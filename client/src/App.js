import React, { Component } from 'react';
import Pusher from 'pusher-js';
import pushid from 'pushid';
import './App.css';

class App extends Component {
  state = {
    newsItems: [],
  }

  componentDidMount() {
    fetch('http://localhost:5000/live')
      .then(response => response.json())
      .then(articles => {
        this.setState({
          newsItems: [...this.state.newsItems, ...articles],
        });
      }).catch(error => console.log(error));

    const pusher = new Pusher('6dd16304a8d9e90f8877', {
      cluster: 'eu',
      encrypted: true,
    });

    const channel = pusher.subscribe('news-channel');
    channel.bind('update-news', data => {
      this.setState({
        newsItems: [...data.articles, ...this.state.newsItems],
      });
    });
  }

  render() {
    const NewsItem = (article, id) => (
      <li key={id}><a href={`${article.url}`}>{article.title}</a></li>
    );

    const newsItems = this.state.newsItems.map(e => NewsItem(e, pushid()));

    return (
      <div className="App">
        <h1 className="App-title">Live Bitcoin Feed</h1>

        <ul className="news-items">{newsItems}</ul>
      </div>
    );
  }
}

export default App;
