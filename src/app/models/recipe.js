//arquivo responsável por operações de banco de dados
const db = require('../config/db')
const { age, date } = require('../../lib/utils')

module.exports = {
    all(callback) {
        //função apenas chama quando leitura do banco de dados
        db.query(`
        SELECT * 
        FROM recipes 
        ORDER BY title ASC`, function (err, results) {
            if (err) throw `Database error!${err}`

            callback(results.rows)
        })
    },
    create(data, callback) {
        const query = `
            INSERT INTO recipes(
                chef_id,
                image,
                title,
                ingredients,
                preparation,
                information,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
        `
        const values = [
            data.chef_id,
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            date(Date.now()).iso
        ]

        db.query(query, values, function (err, results) {

            if (err) throw `Database error!${err}`
            callback(results.rows[0])
        })
    },
    find(id, callback){
        db.query(`
                SELECT * 
                FROM recipes 
                WHERE id = $1`, [id], function(err, results){
                    if (err) throw `Database error!${err}`
                    callback(results.rows[0])
        })
    },
    update(data, callback){
        const query = `
            UPDATE recipes SET
                chef_id=($1),
                image=($2),
                title=($3),
                ingredients=($4),
                preparation=($5),
                information=($6),
            WHERE id = $7
        `

        const values = [
            data.chef_id,
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.id
        ]

        db.query(query, values, function(err, results){
            if (err) throw `Database error!${err}`

            callback()
        })
    },
    delete(id, callback){
        db.query(
            `DELETE 
                FROM recipes 
                WHERE id = $1
            `
            , [id], function(err, results){
            if (err) throw `Database error!${err}`

            return callback()
        })
    }
}