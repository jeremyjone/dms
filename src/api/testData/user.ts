export const TEST_PERMISSIONS = [
  "library.show",
  "library.create",
  "library.edit",
  "library.delete",
  "data.show",
  "data.create",
  "data.edit",
  "data.delete",
  "system.show",
  "system.edit"
].map((x, i) => {
  return {
    id: i + 1,
    name: x,
    description: "",
    default: true,
    value: true
  };
});

export const TEST_ROLES = [
  {
    id: 1,
    name: "Admin",
    description: "ADMIN",
    permissions: TEST_PERMISSIONS
  },
  {
    id: 2,
    name: "Vip",
    description: "Vip",
    permissions: TEST_PERMISSIONS.map(x => {
      if (x.name.startsWith("system")) x.value = false;
      return x;
    })
  },
  {
    id: 3,
    name: "User",
    description: "USER",
    permissions: TEST_PERMISSIONS.map(x => {
      if (x.name.endsWith("show") && x.name.startsWith("system")) {
        x.value = false;
      }

      return x;
    })
  }
];

export const TEST_USERS = [
  {
    id: 1,
    username: "user1",
    nickname: "USER1",
    role: TEST_ROLES[0]
  },
  {
    id: 2,
    username: "user2",
    nickname: "USER2",
    role: TEST_ROLES[2]
  }
];
