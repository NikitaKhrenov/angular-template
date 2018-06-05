class UserModel {
    constructor(
        public email,
        public password
    ) { }
}

class FormUserModel {
    constructor(
        public email,
        public password,
        public agreementAccepted: boolean
    ) { }
}

export { UserModel, FormUserModel };
