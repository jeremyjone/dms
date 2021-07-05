export const TEST_DATA = [
  {
    id: 1,
    name: "测试",
    size: 0,
    type: "folder",
    thumbnail: "",
    description: "文件夹",
    creatorId: 1,
    creator: {
      id: 1,
      username: "user1",
      nickname: "USER1"
    },
    parentId: 0,
    fileId: 1,
    libraryId: 1,
    updateTime: new Date().toLocaleDateString(),
    createTime: new Date().toLocaleDateString()
  },
  {
    id: 2,
    name: "测试.xlsx",
    size: 1335085,
    type: "xlsx",
    thumbnail: "",
    description: "",
    creatorId: 1,
    creator: {
      id: 1,
      username: "user1",
      nickname: "USER1"
    },
    parentId: 0,
    fileId: 2,
    libraryId: 1,
    updateTime: new Date().toLocaleDateString(),
    createTime: new Date().toLocaleDateString()
  },
  {
    id: 3,
    name: "动画.Gif",
    size: 2848550,
    type: "gif",
    thumbnail: "",
    description: "GIF 动画",
    creatorId: 1,
    creator: {
      id: 1,
      username: "user1",
      nickname: "USER1"
    },
    parentId: 0,
    fileId: 3,
    libraryId: 1,
    updateTime: new Date().toLocaleDateString(),
    createTime: new Date().toLocaleDateString()
  },
  {
    id: 4,
    name: "动画1.Gif",
    size: 284234,
    type: "gif",
    thumbnail: "cover1.jpg",
    description: "GIF 动画1",
    creatorId: 1,
    creator: {
      id: 1,
      username: "user1",
      nickname: "USER1"
    },
    parentId: 0,
    fileId: 4,
    libraryId: 2,
    updateTime: new Date().toLocaleDateString(),
    createTime: new Date().toLocaleDateString()
  }
];

export const TEST_VERSIONS = [
  {
    id: 1,
    version: "V0001",
    comment: "Init",
    file: {
      id: 1,
      path: "",
      info: "{}",
      type: "folder",
      size: 0,
      createTime: new Date().toLocaleDateString(),
      originName: ""
    },
    creator: {
      id: 1,
      username: "user1",
      nickname: "USER1"
    },
    createTime: new Date().toLocaleDateString()
  },
  {
    id: 2,
    version: "V0001",
    comment: "Init",
    file: {
      id: 2,
      path: "/data/sheet.xlsx",
      info: "{}",
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      size: 1335085,
      createTime: new Date().toLocaleDateString(),
      originName: "测试.xlsx"
    },
    creator: {
      id: 1,
      username: "user1",
      nickname: "USER1"
    },
    createTime: new Date().toLocaleDateString()
  },
  {
    id: 3,
    version: "V0001",
    comment: "Init",
    file: {
      id: 3,
      path: "/data/animation.gif",
      info: "{}",
      type: "image/gif",
      size: 2848550,
      createTime: new Date().toLocaleDateString(),
      originName: "动画.Gif"
    },
    creator: {
      id: 1,
      username: "user1",
      nickname: "USER1"
    },
    createTime: new Date().toLocaleDateString()
  },
  {
    id: 4,
    version: "V0001",
    comment: "Init",
    file: {
      id: 4,
      path: "/data/animation1.gif",
      info: "{}",
      type: "image/gif",
      size: 284234,
      createTime: new Date().toLocaleDateString(),
      originName: "动画1.Gif"
    },
    creator: {
      id: 1,
      username: "user1",
      nickname: "USER1"
    },
    createTime: new Date().toLocaleDateString()
  }
];
