import React, { Component } from 'react';
import Tabset from './components/Tabset';
import ArcComponent from './components/ArcComponent';
import MessageComponent from './components/MessageComponent';

import Notifications, { notify } from 'react-notify-toast';

import { parseDiff } from 'react-diff-view';
import 'react-diff-view/style/index.css';

import './App.css';
import { display_theory, remove_theory } from './utils.js';

import axios from 'axios';


class App extends Component {

  state = {
    first_sha: null,
    type: null,
    next_sha: null,
    current_sha: null,
    prev_sha: null,
    message: null,
    current_arc: null,
    files: [],
    theory: [],
  }



  render() {


    if (this.state.type === "arc") {

      return (
        <div className="App">
          <Notifications />
          <ArcComponent
            title={this.state.message}
            description={this.state.files}
            next={this.handleNext} previous={this.handleBack}
            disableNext={this.state.next_sha === this.state.current_sha}
            disablePrevious={this.state.prev_sha === null}
          ></ArcComponent>
        </div>
      )

    } else if (this.state.type === "normal") {
      return (
        <div className="App">
          <Notifications />
          <MessageComponent
            arc={this.state.current_arc}
            message={this.state.message}
            next={this.handleNext} disableNext={this.state.next_sha === this.state.current_sha}
            previous={this.handleBack} disablePrevious={this.state.prev_sha === null}
            theory={this.handleTheory} disableTheory={this.state.theory.length === 0}>
          </MessageComponent>
          {
            this.state.files.length > 0 ?
              <Tabset key={this.state.current_sha} files={remove_theory(this.state.theory, this.state.files)}></Tabset>
              :
              null
          }
        </div>
      );

    } else {
      return (
        <div className="App"></div>
      );
    }




  }



  componentDidMount() {
    this.get_first_commit_data()
  }


  handleNext = () => {
    this.get_commit_data(this.state.next_sha)
  }


  handleBack = () => {

    if (this.state.prev_sha === this.state.first_sha) { //this means that the previous commit is the first commit
      this.get_first_commit_data()
    } else {
      this.get_commit_data(this.state.prev_sha)
    }

  }

  /**
   * Requests and displays the theory resources associated with a commit.
   */
  handleTheory = () => {

    axios.get(`http://localhost:3030/commits/theory/${this.state.current_sha}`)
      .then(response => {
        display_theory(response.data)
      })
      .catch(error => {
        console.log(error)
        notify.show("You've got an error! Check out the console for details.", "error")
      })

  }


  get_commit_data(sha) {
    axios.get(`http://localhost:3030/commits/${sha}`)
      .then(response => {
        this.setState({
          first_sha: this.state.first_sha,
          type: response.data.type,
          next_sha: response.data.next_sha,
          current_sha: response.data.current_sha,
          prev_sha: response.data.prev_sha,
          message: response.data.message,
          current_arc: response.data.type === "arc" ? response.data.message : this.state.current_arc,
          files: response.data.type === "normal" ? parseDiff(response.data.files) : response.data.files,
          theory: response.data.theory
        })
      })
      .catch(error => {
        console.log(error)
        notify.show("You've got an error! Check out the console for details.", "error")
      })
  }

  get_first_commit_data() {
    axios.get('http://localhost:3030/commits')
      .then(response => {
        this.setState({
          first_sha: response.data.current_sha,
          type: response.data.type,
          next_sha: response.data.next_sha,
          current_sha: response.data.current_sha,
          prev_sha: null,
          message: response.data.message,
          current_arc: response.data.type === "arc" ? response.data.message : this.state.current_arc,
          files: response.data.type === "normal" ? parseDiff(response.data.files) : response.data.files,
          theory: response.data.theory
        })
      })
      .catch(error => {
        console.log(error)
        notify.show("You've got an error! Check out the console for details.", "error")
      })
  }

}



export default App;
