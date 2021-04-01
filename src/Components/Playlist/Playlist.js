import React from 'react';
import './Playlist.css';

export class Playlist extends React.Component {
    render() {
        return (
            <div className="Playlist">             
                <input value="New Playlist"/>
                {/* <Tracklist /> */}
                <button className="Playlist-save">SAVE TO SPOTIFY</button>
            </div>
        );
    }
};