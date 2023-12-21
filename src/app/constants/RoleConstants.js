// Trong tệp roles.js

export const roles = {
    User: {
        "id": 1,
        "name": "User",
        "description": "Khách hàng",
        "is_default": "true",
        "role_type_id": 1,
      
    },
    Admin: {
        "id": 2,
        "name": "Admin",
        "description": "Chủ sở hữu toàn quyền hệ thống",
        "is_default": "true",
        "role_type_id": 2,
    },
    ManageShop: {
        "id":3,
        "name": "ManageShop",
        "description": "Quản lí đơn hàng",
        "is_default": "true",
        "role_type_id": 3
    },
    ManageCourse: {
        "id": 4,
        "name": "ManageCourse",
        "description": "Quản lí khóa học",
        "is_default": "true",
        "role_type_id": 4,
    },
    ManageBlog: {
        "id": 5,
        "name": "ManageBlog",
        "description": "Quản lí Blog",
        "is_default": "true",
        "role_type_id": 5,
    }
};
