import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import morgan from 'morgan';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const existingBlogs = [
	{ 'id': 1, 'postTitle': 'title one', 'postContent': 'content one'},
	{ 'id': 2, 'postTitle': 'title two', 'postContent': 'content two'}, 
	{ 'id': 3, 'postTitle': 'title three', 'postContent': 'content three'}
];   // temporary storage for blogs

app.use(express.static('public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.text({ type: 'text/html' }));

// ------------ ROOT ----------------
app.get('/', (req, res) => {
  res.render(`index.ejs`, { existingBlogs: existingBlogs });
	// { existingBlogs: [{'id': 8347892, 'title': 'This is a sample post'}, {'id': 382002, 'title': 'This is another row'}] }
});
// -------------------- NEW --------------------
app.get('/new', (req, res) => {
	res.render(`new-post.ejs`);
});
// -------------------- NEW POST -----------------
app.post('/newPost', (req, res) => {
	// console.log(req.body);
	// res.status(200).end();  // Don't spin forever
	// When the 'New' form is filled out with a new post
	existingBlogs.push({ 'id': existingBlogs.length+1, 'postTitle': req.body['postTitle'], 'postContent': req.body['postContent'] });
	res.redirect('/');
});
// --------------------- View/EDIT ----------------
app.post('/viewEdit', (req, res) => {
	// console.log(`full body query:`, req.body);  // I need to find out where my radios are
	res.render('editPost.ejs', { blogToEdit: existingBlogs.find((currentPost) => {return currentPost['id']===parseInt(req.body['postsRadios'])}) });
	/*
	console.log(`Current existing Blogs array:`, existingBlogs);
	console.log(`Posts Radios received:`, req.body['postsRadios']);
	console.log(`Type of variable of the post Radios received:`, typeof req.body['postsRadios']);
	console.log(`After type conversion to integer:`, typeof parseInt(req.body['postsRadios']));
	console.log(`Type of id in the existing Posts array:`, typeof existingBlogs[0]['id']);
	console.log(`First find on existing Blogs:`, existingBlogs.find((eachPost) => {return eachPost['id']===1}));
	console.log(`Second find with ID comparison:`, existingBlogs.find((eachPost) => {return eachPost['id']===parseInt(req.body['postsRadios'])}));
	res.status(200).end();
	*/
});
// ------------------------- UPDATE POST ----------------------
app.post('/updatePost', (req, res) => {
	// edit.html form submitted
	console.log(`Working with element ${req.body['id']}, current values: `, existingBlogs[existingBlogs.findIndex((element) => element['id'] === parseInt(req.body['id']))]);
	console.log(`New values: `, req.body);
	existingBlogs[existingBlogs.findIndex((element) => element['id'] === parseInt(req.body['id']))] = {'id': parseInt(req.body['id']), 'postTitle': req.body['postTitle'], 'postContent': req.body['postContent']};
	console.log(`Final existing Blogs array: `, existingBlogs);
	res.redirect('/');
});
// ---------------------- DELETE POST -----------------------
app.post('/deletePost', (req, res) => {
	// Called when the user clicks on the Delete button to delete the selected post
	// console.log(req.body);  // Just checking
	// console.log(`Id of the element to delete ${parseInt(req.body['postsRadios'])}`);
	// console.log(`Rigged findIndex results: ${existingBlogs.findIndex((element) => element['id'] === 1 )}`);
	// console.log(`found in Index ${existingBlogs.findIndex((element) => element['id'] === parseInt(req.body['postsRadios']))}`);
	const deletedItem = existingBlogs.splice(existingBlogs.findIndex((element) => element['id'] === parseInt(req.body['postsRadios'])), 1);
	console.log(`item Deleted: `, deletedItem);
	console.log(`new existing Blogs: `, existingBlogs);
	res.redirect('/');
});

// --------------------- 404 NOT FOUND ---------------
app.all('*', (req, res) => {
	// Add troubleshooting information
	console.log(`Current blogs: `, existingBlogs);
	console.log(`Request method: `, req.method);
	console.log(`Request body: `, req.body);
	res.status(404);
	if (req.accepts('html')) {
		res.sendFile(path.join(__dirname, 'views', '404.html'));
	} else if (req.accepts('json')) {
		res.json({ error: '404 not found' });
	} else {
		res.type('txt').send('404 Not Found');
	}
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

