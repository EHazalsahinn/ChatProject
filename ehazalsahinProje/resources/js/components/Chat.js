import React, {Component} from 'react';
import ReactDOM from "react-dom";
import io from "socket.io-client";
import Mesajlar from './Mesajlar';

const socket = io('http://127.0.0.1:8005');

class Chat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            kullanici:"",
            mesaj:"" ,
            mesajlar: [],
            users: [],
            cikisYapanlar:[],
        }
        this.yeniMesaj = this.yeniMesaj.bind(this);
    }

    componentDidMount() {
        this.setState({
            kullanici: this.props.name,
        });
        let username= this.props.name;
        socket.emit('kullanici', username, function (data) {
            if (!data){
                alert('Bu kullanıcı şu an odada! Yönlendiriliyorsunuz...');
                window.location.href="/"
            }
        });

        socket.on('mesaj', function (data){
            this.setState(prevState => ({
                mesajlar:[...prevState.mesajlar, data]
            }))
        }.bind(this));

        socket.on('users', function (data) {
            this.setState({
                users:[...data]
            })
        }.bind(this));

        socket.on('cikisYapanlar', function(exit) {
            this.setState({
                cikisYapanlar:[exit]
            })
        }.bind(this))
    }

    yeniMesaj(e) {
        e.preventDefault();
        let mesaj = this.state.mesaj;
        socket.emit('gonder', mesaj);
        this.setState({
            mesaj:""
        })
    };
    cıkısYap(e){
        e.preventDefault();
        socket.emit('cıkısYap', this.state.kullanici, (deger) =>{
            if(deger){
                window.location.href='/';
            }
        });
    }

    render() {
        return(
            <div className="container">
                <h4 className="display-4 text-center"> Chat'e Hoşgeldin :) </h4> 
                <div className="row justify-content-center">
                        <div className="col-md-3 align-self-center">
                                    <div className="head" style={{height:"300px", border:"1px solid", marginTop: '5px', marginBottom: '5px'}} >
                                        <h5 style={{textAlign: 'center'}}>Kullanıcılar</h5>
                                        <hr />
                                        {
                                            this.state.users.map((kullanici, i) => (
                                                <li key={i}>{kullanici} </li>
                                            ))
                                        }
                                    </div>
                                    <div className="input-group-append">
                                     <button onClick={this.cıkısYap.bind(this)} className="btn btn-danger btn-sm" type="button">Çıkış</button>
                                    </div>
                                    <div className="head" style={{height:"50px", border:"1px solid", marginTop: '5px'}} >
                                        {
                                            this.state.cikisYapanlar.map((cikis, i) => (
                                                <li key={i}>{cikis} adlı kullanıcı çıkış yaptı.</li>
                                            ))
                                        }
                                    </div>
                        </div>
                        <div className="col-md-9 ">
                            <div style={{height:"500px",border:"2px solid", width: 'auto', marginTop: '5px', marginBottom: '5px'}} >
                                {
                                     this.state.mesajlar.map((mesaj,i) => (
                                        <Mesajlar key={i} user={mesaj.nick} mesaj={mesaj.msg} />
                                    ))
                                }
                           </div>
                           <div className="input-group mb-3">
                                    <input id="mesaj" value={this.state.mesaj} onChange={ event => this.setState({mesaj: event.target.value})} className="form-control" placeholder="...." aria-describedby="basic-addon2"  />
                                <div className="input-group-append">
                                    <button onClick={this.yeniMesaj} className="btn btn-warning btn-sm" type="button">Gönder</button>
                                </div>
                                
                            </div> 
                        </div>
                </div>
            </div>
        );
    }
}

export default Chat ;

if (document.getElementById('chat')) {
    var veri = document.getElementById('chat').getAttribute('data');
    ReactDOM.render(<Chat name={veri} />, document.getElementById('chat'));
}
