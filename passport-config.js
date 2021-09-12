const LocalStrategy = require('passport-local').Strategy;
//const passport = require('passport')
const Member = require('./models/member.js');
const bcrypt = require('bcrypt');

function initialize(passport) {
    // passport.use(Member.createStrategy());
    // console.log(Member.createStrategy());
    // passport.use(new LocalStrategy({
    //     async function(email, password,done) {
    //         Member.findOne({email : email}, (err, member) => {
    //             if(err) {return done(err);}
    //             if(!member) {return done(null, false, { message: 'Kullanici bulunamadi.'});}
    //             if(await bcrypt.compare(password, member.passwordHashed)) {return done(null, false, {message : 'Yanlis sifre'});}
    //             return done(null, member);
    //         })
    //     }
    // }))
    // passport.serializeUser(Member.serializeUser());
    // passport.deserializeUser(Member.deserializeUser());


    passport.serializeUser(function(user,done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        Member.findById(id, function(err, user) {
            done(err,user);
        });
    });

    passport.use(new LocalStrategy(function(email, password, done) {
        Member.findOne({email : email}, function(err, user) {
            if(err) {return done(err);}
            if(!user) {
                console.log('email incorrect');
                return done(null, false, {message : 'Incorrect Email'});
            }
            bcrypt.compare(password, user.password, function(err,res) {
                if(err) {return done(err);}
                if(res == false) {
                    console.log('incorrect password');
                    return done(null, false, {message : 'Incorrect Password'});
                }
                return done(null, user);
            });
        })
    }))
}




// function initialize(passport, getMemberByEmail, getMemberById) {
//     const authenticateUser = async (email, password, done) => {
//         const user = await getMemberByEmail(email);
//         if(user == null) {
//             return done(null, false, {message : 'Bu kullanici mevcut degil'});
//         }

//         try {
//             if(await bcrypt.compare(password, user.passwordHashed)) {
//                 console.log('successfully logged in');
//                 return done(null, user);
//             } else {
//                 return done(null, false, {message : 'Yanlis sifre'});
//             }
//         } catch (error) {
//             return done(error);
//         }


//     }
//     passport.use(new LocalStrategy({usernameField : 'email'}, authenticateUser));
//     passport.serializeUser((user, done) => done(null,user.id));
//     passport.deserializeUser((id, done) => {
//         return done(null, getMemberById(id));
//     });
// }



module.exports = initialize;