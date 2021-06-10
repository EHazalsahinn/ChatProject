import React from 'react';
import ReactDOM from 'react-dom';
import Giris from './Giris';

function Anasayfa() {
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card" >
                        <Giris />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Anasayfa;

if (document.getElementById('anasayfa')) {
    ReactDOM.render(<Anasayfa />, document.getElementById('anasayfa'));
}
