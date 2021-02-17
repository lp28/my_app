import React, { Component } from 'react';

import { Tabs, Tab } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { parseDiff, Diff, Hunk, tokenize } from 'react-diff-view';
import 'react-diff-view/style/index.css';
import refractor from 'refractor';



class Tabset extends Component {

  renderToken = (token, defaultRender, i) => {
    switch (token.type) {
      case 'space':
        console.log(token);
        return (
          <span key={i} className="space">
            {token.children && token.children.map((token, i) => renderToken(token, defaultRender, i))}
          </span>
        );
      default:
        return defaultRender(token, i);
    }
  };

  customize_options(file) {
    let file_path = file.newPath.split('.')
    let extension = file_path[file_path.length - 1]

    let options = {
      highlight: true,
      refractor: refractor,
      language: extension
    }
    return options
  }

  get_active_tab(files) {

    for (let file of files) {
      let check = is_supported_extension(file.hunks, this.customize_options(file))
      if (check.supported) {
        return file.newPath;
      }
    }

    return files[0].newPath;
  }


  render() {
    let { files } = this.props

    return (

      <Tabs defaultActiveKey={this.get_active_tab(files)}>
        {
          files.map(file => {
            let check = is_supported_extension(file.hunks, this.customize_options(file))
            if (check.supported) {
              return (
                <Tab key={file.newPath} eventKey={file.newPath} title={file.newPath}>
              <div key={file.newPath} className="tab-item-wrapper">
                <Diff
                  key={file.oldRevision + '-' + file.newRevision}
                  viewType="unified" diffType={file.type}
                  hunks={file.hunks}
                  tokens={check.tokens}></Diff>
              </div>
            </Tab>
              );
            }
            return null;
          })
        }
      </Tabs>
    );
  }
}


function is_supported_extension(hunks, options) {
  let supported = true;
  let tokens;
  try {
    tokens = tokenize(hunks, options)
  } catch (error) {
    supported = false;
    tokens = null;
    //console.log(error);
  }
  return {
    supported: supported,
    tokens: tokens,
  };
}

export default Tabset;


