

const l0 = [
  {
    name: 'my-dir',
    isDirectory: true,
    path: '/tmp/my-dir',
    size: '400 Mib',
    sizeInKib: 204800,
  },
  {
    name: 'my-file',
    isDirectory: false,
    path: '/tmp/my-file',
    size: '20 Mib',
    sizeInKib: 102400,
  },
];

const l1 = [
  {
    name: 'sample01',
    isDirectory: false,
    path: '/tmp/my-dir/sample01',
    size: '50 Mib',
    sizeInKib: 102400,
  },
  {
    name: 'dir01',
    isDirectory: true,
    path: '/tmp/my-dir/dir01',
    size: '300 Mib',
    sizeInKib: 102400,
  },
];

const l2 = [
  {
    name: 'sample02',
    isDirectory: false,
    path: '/tmp/my-dir/dir01/sample02',
    size: '250 Mib',
    sizeInKib: 102400,
  },
];

const all = [...l0, ...l1, ...l2];

const figureOut = (path) => {
  let data = [];
  switch (path) {
    case '/tmp':
      data = l0;
      break;
    case '/tmp/my-dir':
      data = l1;
      break;
    case '/tmp/my-dir/dir01':
      data = l2;
      break;
    default:
      data = l0;
      break;
  }
  const data1 = data.filter((x) => x.deleted !== true )
  return { resultList: data1 };
};

const fetchTheData = (path) => {
  throw(new Error('fetchTheData'));
  return new Promise((resolve, x) => {
    resolve(figureOut(path));
  });
};

const deleteTheFile = (path) => {
  return new Promise((resolve, x) => {
    const item = all.find((x) => x.path === path );
    if (item !== undefined) { item.deleted = true; }
    resolve();
  })
}

export { fetchTheData, deleteTheFile };
