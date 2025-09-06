// server.js
return ok(res, p);
});


app.delete('/api/products/:id', requireAuth, (req, res) => {
let products = db.read('products');
const p = products.find(p => p.id === req.params.id);
if (!p) return bad(res, 'Not found', 404);
if (p.ownerId !== req.user.id) return bad(res, 'Forbidden', 403);
products = products.filter(x => x.id !== p.id);
db.write('products', products);
return ok(res, true);
});


// ---- Cart & Orders (previous purchases) ----
// Simple cart is kept in session for prototype
app.get('/api/cart', (req, res) => ok(res, req.session.cart || []));
app.post('/api/cart/add', (req, res) => {
const { productId } = req.body || {};
const product = db.read('products').find(p => p.id === productId);
if (!product) return bad(res, 'Invalid product');
const cart = req.session.cart || [];
if (!cart.find(i => i.productId === productId)) cart.push({ productId });
req.session.cart = cart; return ok(res, cart);
});
app.post('/api/cart/remove', (req, res) => {
const { productId } = req.body || {};
const cart = (req.session.cart || []).filter(i => i.productId !== productId);
req.session.cart = cart; return ok(res, cart);
});


app.post('/api/checkout', requireAuth, (req, res) => {
const cart = req.session.cart || [];
if (!cart.length) return bad(res, 'Cart empty');
const orders = db.read('orders');
const products = db.read('products');
const items = cart
.map(c => products.find(p => p.id === c.productId))
.filter(Boolean);
const order = { id: nanoid(), userId: req.user.id, items, createdAt: Date.now() };
orders.push(order); db.write('orders', orders);
req.session.cart = [];
return ok(res, order);
});


app.get('/api/orders', requireAuth, (req, res) => {
const orders = db.read('orders').filter(o => o.userId === req.user.id)
.sort((a,b)=>b.createdAt-a.createdAt);
return ok(res, orders);
});


// Fallback to SPA
app.get('*', (req, res) => {
res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`EcoFinds running on :${PORT}`));
