import React from 'react'

const Startup = (props) =>
  <div>
    <a href='#' className="select-folder" onClick={props.selectFolder}>
      Select a folder to scan
    </a>
  </div>;

export default Startup;
