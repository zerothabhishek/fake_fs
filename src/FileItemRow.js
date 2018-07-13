import React from 'react';

const FileItemName = ({ name, isDirectory, onClick }) => 
  isDirectory ?
    <a href="#" className='the-file-name' onClick={ onClick }> { name } </a> :
    <span> { name } </span>
;

const DeleteButton = ({ onClick }) =>
  (<span>
    <button onClick={ onClick }>x</button>
    &nbsp;
  </span>);

const FileItemRow = props =>
  (<tr>
    <td> <FileItemName name={props.name} isDirectory = {props.isDirectory} onClick={props.onClick} /> </td>
    <td> {props.size} </td>
    <td> 
      { props.markedForDeletion ||
        <DeleteButton onClick= {props.onMarkForDeletion} /> }
    </td>
    { props.markedForDeletion &&
    <td> ~~~~ </td>}
  </tr>);


export default FileItemRow;
