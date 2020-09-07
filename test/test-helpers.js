function makeUsersArray() {
    return [
        {
            "first_name": "Eli",
            "last_name": "Reiner",
            "email": "goelyukim@g.com",
            "user_password": "plplplplokokok",
            "online_medium": true,
            "in_person": false,
            "student": false,
            "tutor": true,
            "gender": "male",
            "rating": null,
            "fee": 9
        }
    ]
}

function makeMaliciousUser() {
    const maliciousUser = {
        first_name: "Eli",
        last_name: "Reiner",
        user_password: "plplplplokokok",
        online_medium: true,
        in_person: false,
        student: false,
        tutor: true,
        fee: 9,
        gender: 'Naughty naughty very naughty <script>alert("xss");</script>',
        email: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`
    }
    const expectedUser = {
        ...maliciousUser,
        gender: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        email: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
    }
    return {
        maliciousUser,
        expectedUser
    }
}

function cleanTables(db) {
 /*   return db.transaction(trx =>
      trx.raw(
        `TRUNCATE
          blogful_articles,
          blogful_users,
          blogful_comments
        `
      )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE blogful_articles_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE blogful_users_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE blogful_comments_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('blogful_articles_id_seq', 0)`),
          trx.raw(`SELECT setval('blogful_users_id_seq', 0)`),
          trx.raw(`SELECT setval('blogful_comments_id_seq', 0)`),
        ])
      )
    )*/
  }

module.exports = {
    makeUsersArray,
    makeMaliciousUser,
    cleanTables
}