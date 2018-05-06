import React from 'react';

const FileItemName = ({ name, isDirectory, onClick }) => 
  isDirectory ?
    <a href="#" className='the-file-name' onClick={ onClick }> { name } </a> :
    <span> { name } </span>
;

const DeleteButton = ({ onClick }) =>
  <span>
    <a href="/delete" className='delete-button' onClick={ onClick }>
      Mark for deletion
    </a>
    &nbsp;
  </span>;

const FileItemRow = (props) =>
  <tr>
    <td> <FileItemName name={props.name} isDirectory = {props.isDirectory} onClick={props.onClick} /> </td>
    <td> {props.size} </td>
    <td> <DeleteButton onClick= {props.onMarkForDeletion} /> </td>
  </tr>;


export default FileItemRow;
