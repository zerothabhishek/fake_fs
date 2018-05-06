import React from 'react'
import { connect } from 'react-redux';
import FileItemRow  from './FileItemRow';

class Explorer extends React.Component {

  constructor(props) {
    super(props)
    this.onClick = this.onClick.bind(this);
    this.onMarkForDeletion = this.onMarkForDeletion.bind(this);
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'LOAD_DATA',
      currentTarget: this.props.currentTarget
    });
  }

  onClick(fileItem) {
    return (e) => {
      e.preventDefault();
      this.props.dispatch({ 
        type: 'LOAD_DATA',
        currentTarget: fileItem.path
      })
    }
  }

  onMarkForDeletion(fileItem) {
    return (e) => {
      e.preventDefault();
      // this.props.fileMarkedForDeletion(fileItem)
      this.props.dispatch({
        type: 'MARKED_FOR_DELETION',
        target: fileItem.path
      })
    }
  }

  render() {
    const fileData = this.props.fileData || [];
    // console.log('rendering...', fileData);
    return (
      <div>
        Explorer:
        <h3> { this.props.currentTarget } </h3>
        <table>
          <tbody>
            {fileData.map((fileItem, index) =>
              <FileItemRow
                name={fileItem.name}
                size={fileItem.size}
                onClick={this.onClick(fileItem)}
                onDelete={this.onMarkForDeletion(fileItem)}
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

const mapStateToProps = state => ({
  fileData: state.fileData,
  currentTarget: state.currentTarget
});

const mapDispatchToProps = dispatch =>  {
  return {
    loadData: (currentTarget) => dispatch({ type: 'LOAD_DATA', currentTarget }),
    fileItemClicked: (fileItem) => dispatch({ type: 'TOP_CHANGED', currentTarget: fileItem.path }),
    fileMarkedForDeletion: (fileItem) => dispatch({ type: 'FILE_DELETED', filePath: fileItem.path })
  }
}

export default connect(mapStateToProps)(Explorer);
