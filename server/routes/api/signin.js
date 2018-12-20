const User = require('../../models/User');
const UserSession = require('../../models/UserSession');


module.exports = (app) => {
  /*
   * Signup
   */
  app.post('/api/account/signup', (req, res, next) => {
    const { body } = req;
    const {
      nickname,
      password
    } = body;
    let {
      email
    } = body;

    if (!email) {
      return res.send({
        success: false,
        message: 'Error: email no puede estar vacio'
      });
    }
    if (!password) {
      return res.send({
        success: false,
        message: 'Error: password no puede estar vacio'
      });
    }
    if (!nickname) {
      return res.send({
        success: false,
        message: 'Error: nick no puede estar vacio'
      });
    }

    email = email.toLowerCase();
    email = email.trim();

    User.find({
      "$or": [{
        "email": email
      }, {
        "nickname": nickname
      }]
    }, (err, previousUsers) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error: Server error'
        });
      } else if (previousUsers.length > 0) {
        return res.send({
          success: false,
          message: 'Error: Cuenta ya existe.'
        });
      }

      // Guardar Usuario
      const newUser = new User();

      newUser.email = email;
      newUser.password = newUser.generateHash(password);
      newUser.nickName = nickname;
      newUser.save((err, user) => {
        if (err) {
          return res.send({
            success: false,
            message: 'Error: Server error'
          });
        }
        return res.send({
          success: true,
          message: 'Registrado'
        });
      });
    });
  });

  app.post('/api/account/signin', (req, res, next) => {
    const { body } = req;
    const {
      password
    } = body;
    let {
      email
    } = body;

    if (!email) {
      return res.send({
        success: false,
        message: 'Error: Email vacio.'
      });
    }
    if (!password) {
      return res.send({
        success: false,
        message: 'Error: Password vacio.'
      });
    }
    const newUser = new User();
    email = email.toLowerCase();
    email = email.trim();

    User.find({
      email: email
    }, (err, users) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error: server error'
        });
      }
      if (users.length != 1) {
        return res.send({
          success: false,
          message: 'Error: Invalido'
        });
      }

      const user = users[0];
      if (!user.validPassword(password)) {
        return res.send({
          success: false,
          message: 'Error: Invalid'
        });
      }

      const userSession = new UserSession();
      userSession.userId = user._id;
      userSession.save((err, doc) => {
        if (err) {
          console.log(err);
          return res.send({
            success: false,
            message: 'Error: server error'
          });
        }

        return res.send({
          success: true,
          nick: user.nickName,
          message: '',
          token: doc._id
        });
      });
    });
  });

  app.get('/api/account/logout', (req, res, next) => {
    // Get token
    const { query } = req;
    const { token } = query;
    // ?token=test


    UserSession.findOneAndUpdate({
      _id: token,
      isDeleted: false
    }, {
      $set: {
        isDeleted:true
      }
    }, null, (err, sessions) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error: Server error'
        });
      }

      return res.send({
        success: true,
        message: 'Bien'
      });
    });
  });

  app.get('/api/account/verify', (req, res, next) => {
    
    const { query } = req;
    const { token } = query;
    // ?token=test


    UserSession.find({
      _id: token,
      isDeleted: false
    }, (err, sessions) => {
      if (err) {
        console.log(err);
        return res.send({
          success: false,
          message: 'Error: Server error'
        });
      }

      if (sessions.length != 1) {
        return res.send({
          success: false,
          message: 'Error: Invalido'
        });
      } else {
        // DO ACTION
        return res.send({
          success: true,
          message: 'Bien'
        });
      }
    });
  });
}
