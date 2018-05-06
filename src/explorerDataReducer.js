

const explorerData = (state = {}, action) => {
  switch (action.type) {
    case 'TOP_SCAN_DONE':
      return Object.assign({}, state, { fileData: action.fileData } )
    case 'FILE_DATA_LOADED':
      return Object.assign({}, state, { fileData: action.fileData } )
    case 'LOAD_DATA':
      return Object.assign({}, state, { currentTarget: action.currentTarget });
    case 'MARKED_FOR_DELETION':
      let fds = [...state.fileData];
      const fd = fds.filter((fi) => fi.path === action.target )[0];
      fd.deleted = true;
      return Object.assign({}, state, { fileData: fds });
    default:
      return state;
  }
}


export default explorerData;
