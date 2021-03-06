import React, { Component } from 'react';
import SearchSVG from './icons/searchSVG';
import MenuParent from './menuParent.js'
import * as Spotify from '../lib/fetchFromSpotify.js'

class Search extends Component {

    constructor(props) {
        super(props);
        //this.handleChange = this.handleChange.bind(this);
        this.submitQuery = this.submitQuery.bind(this);
        this.selectTrack = this.selectTrack.bind(this);
    }

    state = {
        searchTerms: '',
        searchResults: [],
        searchResultsPresent: false,
        error: null
    }

    async submitQuery(e) {
        e.preventDefault();

        this.setState({
            searchResults: [],
            searchResultsPresent: true
        })

        if (!(this.props.mode === 'search')) {
            this.props.setAppMode('search')
        }

        if (this.props.tokenNeedsRefreshed(this.props.tokenInfo)) {
            await this.props.updateToken();
        }
        const data = await Spotify.fetchSearchResults(this.state.searchTerms, this.props.token).catch((error) => {
            console.log('search error', error)
            this.setState({ error })
        })

        if (data) {
            let tracks = data.tracks.items.map((item) => {
                let artists = item.artists.map((artist, index) => {
                    if (index > 0) {
                        return (
                            <span key={artist.id}> • {artist.name} </span>
                        )
                    } else {
                        return (
                            <span key={artist.id}> {artist.name} </span>
                        )
                    }
                })
                return (
                    <div key={item.id} className="track-wrapper"
                        id={item.id}
                        onClick={this.selectTrack}>
                        <span data-testid='searchResults_name'>{item.name}</span>
                        <span className="track-artists">{artists}</span>
                    </div>
                )
            })
            this.setState({
                searchResults: tracks,
                searchResultsPresent: true
            })
        }
    }

    selectTrack = (e) => {
        e.preventDefault();
        this.props.setActiveTrack(e.currentTarget.getAttribute('id'))
    }


    render() {
        const { searchTerms, error, searchResultsPresent, searchResults } = this.state;
        return (
            <div className='search'>
                <MenuParent/>
                <div className={'search-wrapper ' + (!searchResultsPresent && 'full')}>
                    <div className='search-inner'>
                        <p className={'search-prompt ' + (searchResultsPresent && 'bar')}>
                            Search for songs by album name, song name, or artist
                        </p>
                        <form onSubmit={this.submitQuery} className='search-form'>
                            <input
                                className='search-input'
                                type='text'
                                value={searchTerms}
                                onChange={e => this.setState({ searchTerms: e.target.value })} />
                            <button className='search-button-icon' type='submit'>
                                <SearchSVG />
                            </button>
                        </form>
                    </div>
                </div>
                {(this.props.mode === "search") ?
                    (error ? <div> error! <pre>{JSON.stringify(error, null, 2)}</pre></div>
                        :
                        <div className="searchResults">
                            {searchResults.length === 0 && searchResultsPresent ? <div className='loader'></div> : searchResults}
                        </div>
                    ) : ''}
                
            </div>
        )
    }
}

export default Search;