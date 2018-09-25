import React from 'react'
import _ from 'lodash';
import FileItemRow  from './FileItemRow';
import { observer } from 'mobx-react';

const parentOf = (path) => _.dropRight(path.split('/'), 1).join('/');

@observer
class Explorer extends React.Component {

  constructor(props) {
    super(props)
    this.onClick = this.onClick.bind(this);
    this.onMarkForDeletion = this.onMarkForDeletion.bind(this);
    this.goUp = this.goUp.bind(this);
  }

  componentDidMount() {
    // this.props.store.fetchFileData(this.props.store.currentTarget);
  }

  goUp(e) {
    e.preventDefault();
    window.foo && window.foo();
    const path = parentOf(this.props.store.currentTarget);
    // this.props.store.fetchFileData(path);
    window.madFs.home.ipc.startScanTop(path);
  }

  onClick(fileItem) {
    return (e) => {
      // dispatch action that changes store.currentTarget
      e.preventDefault();
      // this.props.store.fetchFileData(fileItem.path);
      window.madFs.home.ipc.startScanTop(fileItem.path);
    }
  }

  onMarkForDeletion(fileItem) {
    return (e) => {
      e.preventDefault();
      // this.props.store.markForDeletion(fileItem.path);
      this.props.store.markForDeletion(fileItem);
    }
  }

  render() {
    const store = this.props.store;

    return (
      <div>
        <h2>Explorer</h2>
        <h3> { store.currentTarget } </h3>

        {store.isOnTop ||
          <button onClick={ this.goUp }> Up </button>}

        <table>
          <tbody>
            {store.theFileData.map((fileItem, index) =>
              <FileItemRow
                name={fileItem.name}
                size={fileItem.size}
                markedForDeletion={fileItem.markedForDeletion}
                onClick={this.onClick(fileItem)}
                onMarkForDeletion={this.onMarkForDeletion(fileItem)}
                isDirectory={fileItem.isDirectory} 
                key={index}
              />
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

// Explorer = observer(Explorer);
export default Explorer;
