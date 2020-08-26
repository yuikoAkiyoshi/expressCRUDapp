const express = require('express');
const mysql = require('mysql');
const app = express();

app.use(express.static('public'));//静的配信のフォルダを指定
app.use(express.urlencoded({extended: false}));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',//mysqlと合わせる
  password: '',//mysqlと合わせる
  database: 'express_db'
});

//viewsディレクトリ以下のejsファイル認識させる
app.set('views', './views');
app.set('view engine', 'ejs');

//一覧画面のルーティング
app.get('/', (req, res) => {
    connection.query(
      'SELECT * FROM items',
      (error, results) => {
        res.render('index.ejs', {items: results});//itemというキーでviewにデータベースの中身を渡せる
      }
    );
});

//新規作成画面のルーティング
app.get('/new', (req, res) => {
    res.render('new.ejs');
});
//新規作成アクション
app.post('/create', (req, res) => {
connection.query(
    'INSERT INTO items (title, text) VALUES (?, ?)',
    [req.body.itemTitle, req.body.itemText],
    (error, results) => {
    res.redirect('/')//methodがpostのときはredirectを使う
    });
});

//編集画面へのルーティング
app.get('/edit/:id', (req, res) => {
    connection.query(
      'SELECT * FROM items WHERE id = ?',
      [req.params.id],
      (error, results) => {
        res.render('edit.ejs', {item: results[0]});
      }
    );
});

//更新アクション
app.post('/update/:id', (req, res) => {
    connection.query(
    'UPDATE items SET title = ?, text = ? WHERE id = ?',[req.body.itemTitle, req.body.itemText, req.params.id],(error,results)=>{
      res.redirect('/');
    })
});

//削除
app.post('/delete/:id', (req, res) => {
    connection.query(
      'DELETE FROM items WHERE id = ?',
      [req.params.id],
      (error, results) => {
        res.redirect('/');
      }
    );
});

app.listen(3000);//3000ポートでローカルサーバーたつ