import React, {Component} from 'react';
import io from "socket.io-client";

const socket = io('http://127.0.0.1:8005');

class Giris extends Component {
    constructor(props){
        super(props);
        this.state = {
            userName: '',
            uyari: false,
            uyariBos: false,
        }
    }
    
    kaydet() {
        const kullaniciAdi = this.state.userName;
        if(kullaniciAdi===''){
            this.setState({
                uyariBos: true
            });

        } else{
            socket.emit('kullanici', kullaniciAdi, (girilenDeger) => {
                if (girilenDeger === false){
                    this.setState({
                        uyari: true
                    });
                } else {
                  $.ajax({
                      type: 'post',
                      url: '/chat-user',
                      headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                      data: {user: kullaniciAdi}
                  }).done((data) => {
                      window.location.href = '/chat?name='+ data;
                  })
                 }
            });
        }
        
    };

    render() {
        return (
            <div className="container" >
                <h3 className="display-4 text-center">Hoşgeldiniz :)</h3>
                <hr />
                {this.state.uyariBos ? (                 
                <div className="alert alert-danger" role="alert">
                   Kullanıcı Adı Boş Olamaz!
                </div>
                ) : ''}
                {this.state.uyari ? (                 
                <div className="alert alert-danger" role="alert">
                   Bu kullanıcı ismi daha önce giriş yapmıştır!
                </div>
                ) : ''}
                <label  style={{marginRight: '7px'}}>Lütfen kullanıcı adını giriniz:</label>
                <input 
                    className="text"
                    id="name"
                    value={this.state.userName}
                    onChange ={(e) => this.setState({ userName: e.target.value })}
                />
                <br />
                <button 
                    className="btn btn-warning "
                    onClick={this.kaydet.bind(this)}
                >
                Giriş
                </button>
                
            </div> 
        );
    }
}

export default Giris;

