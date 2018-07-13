import React, { Component } from 'react';
import { observer } from 'mobx-react';

const FileItem = (props) => (
  <tr>
    <td>{props.path}</td>
    <td>
      <a href="#" onClick={props.onPutBack} >Put back</a>
      &nbsp;
    </td>
    <td>
      <a href="#" onClick={props.onReallyDelete} >Really delete</a>
      &nbsp;
    </td>
  </tr>
)


@observer
class DeletionList extends Component { // eslint-disable-line react/prefer-stateless-function

  componentDidMount() {
    this.props.store.markDeletionListAsSeen();
  }

  render() {
    const theList = this.props.store.deletionList.slice();
    const putBack = (fileItem) => {
      return (e) => {
        e.preventDefault();
        console.log('putting back ', fileItem);
        this.props.store.putBackFileMarkedForDeletion(fileItem.path);
      }
    }
    const reallyDelete = (fileItem) => {
      return (e) => {
        e.preventDefault();
        this.props.store.reallyDelete(fileItem.path);
      }
    }
    return (
      <div>
        <h2> Deletion List </h2>
        <table>
          <tbody>
          {theList.map((x, i) =>
            <FileItem
              path={x.path}
              key={i}
              onPutBack={putBack(x)}
              onReallyDelete={reallyDelete(x)}
            />
          )}
          </tbody>
        </table>
      </div>
    );
  }
}

export default DeletionList;
