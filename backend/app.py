from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os, uuid, hashlib, secrets

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///fixmycity.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'
db = SQLAlchemy(app)

# ── MODELS ──────────────────────────────────────────

class User(db.Model):
    id         = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name       = db.Column(db.String(100), nullable=False)
    email      = db.Column(db.String(200), unique=True, nullable=False)
    password   = db.Column(db.String(200), nullable=False)
    role       = db.Column(db.String(20), default='citizen')
    city       = db.Column(db.String(100), nullable=True)
    token      = db.Column(db.String(64), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {'id': self.id, 'name': self.name, 'email': self.email,
                'role': self.role, 'city': self.city or ''}


class Issue(db.Model):
    id              = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title           = db.Column(db.String(200), nullable=False)
    description     = db.Column(db.Text, nullable=True)
    category        = db.Column(db.String(100), nullable=False)
    urgency         = db.Column(db.Integer, nullable=False)
    lat             = db.Column(db.Float, nullable=False)
    lng             = db.Column(db.Float, nullable=False)
    address         = db.Column(db.String(300), nullable=True)
    image_path      = db.Column(db.String(300), nullable=True)   # uploaded file
    image_url       = db.Column(db.String(500), nullable=True)   # demo url
    upvotes         = db.Column(db.Integer, default=0)
    status          = db.Column(db.String(50), default='open')
    reported_by     = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=True)
    authority_name  = db.Column(db.String(200), nullable=True)
    authority_phone = db.Column(db.String(50), nullable=True)
    authority_email = db.Column(db.String(200), nullable=True)
    created_at      = db.Column(db.DateTime, default=datetime.utcnow)
    comments        = db.relationship('Comment', backref='issue', lazy=True, cascade='all, delete-orphan')
    activities      = db.relationship('Activity', backref='issue', lazy=True, cascade='all, delete-orphan')

    def get_image(self):
        if self.image_path:
            return f'/uploads/{self.image_path}'
        return self.image_url or None

    def to_dict(self):
        reporter = None
        if self.reported_by:
            u = User.query.get(self.reported_by)
            reporter = u.to_dict() if u else None
        return {
            'id': self.id, 'title': self.title, 'description': self.description,
            'category': self.category, 'urgency': self.urgency,
            'lat': self.lat, 'lng': self.lng, 'address': self.address,
            'image_path': self.get_image(),
            'upvotes': self.upvotes, 'status': self.status,
            'reported_by': reporter,
            'authority_name': self.authority_name,
            'authority_phone': self.authority_phone,
            'authority_email': self.authority_email,
            'comment_count': len(self.comments),
            'created_at': self.created_at.isoformat(),
        }


class Comment(db.Model):
    id         = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    issue_id   = db.Column(db.String(36), db.ForeignKey('issue.id'), nullable=False)
    user_id    = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=True)
    text       = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        user = User.query.get(self.user_id) if self.user_id else None
        return {
            'id': self.id, 'text': self.text,
            'user': user.to_dict() if user else {'name': 'Anonymous'},
            'created_at': self.created_at.isoformat(),
        }


class Activity(db.Model):
    id         = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    issue_id   = db.Column(db.String(36), db.ForeignKey('issue.id'), nullable=False)
    action     = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {'id': self.id, 'action': self.action,
                'created_at': self.created_at.isoformat()}


with app.app_context():
    db.create_all()

# ── HELPERS ─────────────────────────────────────────

def hash_pw(pw):
    return hashlib.sha256(pw.encode()).hexdigest()

def current_user():
    token = request.headers.get('Authorization', '').replace('Bearer ', '').strip()
    if not token:
        return None
    return User.query.filter_by(token=token).first()

def log(issue_id, action):
    db.session.add(Activity(issue_id=issue_id, action=action))

# ── AUTH ─────────────────────────────────────────────

@app.route('/api/auth/register', methods=['POST'])
def register():
    d = request.get_json(force=True) or {}
    if not d.get('name') or not d.get('email') or not d.get('password'):
        return jsonify({'error': 'Name, email and password required'}), 400
    if User.query.filter_by(email=d['email']).first():
        return jsonify({'error': 'Email already registered'}), 409
    token = secrets.token_hex(32)
    u = User(name=d['name'], email=d['email'], password=hash_pw(d['password']),
             city=d.get('city', ''), token=token)
    db.session.add(u)
    db.session.commit()
    return jsonify({'user': u.to_dict(), 'token': token}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    d = request.get_json(force=True) or {}
    u = User.query.filter_by(email=d.get('email', '')).first()
    if not u or u.password != hash_pw(d.get('password', '')):
        return jsonify({'error': 'Invalid email or password'}), 401
    token = secrets.token_hex(32)
    u.token = token
    db.session.commit()
    return jsonify({'user': u.to_dict(), 'token': token})

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    u = current_user()
    if u:
        u.token = None
        db.session.commit()
    return jsonify({'ok': True})

@app.route('/api/auth/me', methods=['GET'])
def me():
    u = current_user()
    if not u:
        return jsonify({'error': 'Not logged in'}), 401
    return jsonify(u.to_dict())

@app.route('/api/auth/profile', methods=['POST'])
def update_profile():
    u = current_user()
    if not u:
        return jsonify({'error': 'Not logged in'}), 401
    d = request.get_json(force=True) or {}
    if 'name' in d: u.name = d['name']
    if 'city' in d: u.city = d['city']
    db.session.commit()
    return jsonify(u.to_dict())

# ── ISSUES ───────────────────────────────────────────

@app.route('/api/issues', methods=['GET'])
def get_issues():
    issues = Issue.query.order_by(Issue.created_at.desc()).all()
    return jsonify([i.to_dict() for i in issues])

@app.route('/api/issues', methods=['POST'])
def create_issue():
    u = current_user()
    image_filename = None
    if 'image' in request.files:
        img = request.files['image']
        if img.filename:
            ext = os.path.splitext(img.filename)[1].lower()
            image_filename = f"{uuid.uuid4()}{ext}"
            img.save(os.path.join(app.config['UPLOAD_FOLDER'], image_filename))

    # Try AI classification
    category = request.form.get('category', 'Other')
    urgency  = int(request.form.get('urgency', 5))
    title    = request.form.get('title', 'Civic Issue')

    if image_filename:
        try:
            from classifier import classify_image
            result   = classify_image(os.path.join(app.config['UPLOAD_FOLDER'], image_filename))
            category = result['category']
            urgency  = result['urgency']
            if not request.form.get('title'):
                title = result['suggested_title']
        except Exception as e:
            print(f'Classifier error: {e}')

    issue = Issue(
        title=title, description=request.form.get('description', ''),
        category=category, urgency=urgency,
        lat=float(request.form.get('lat', 20.5937)),
        lng=float(request.form.get('lng', 78.9629)),
        address=request.form.get('address', ''),
        image_path=image_filename,
        reported_by=u.id if u else None,
        authority_name=get_authority(category, 'name'),
        authority_phone=get_authority(category, 'phone'),
        authority_email=get_authority(category, 'email'),
    )
    db.session.add(issue)
    db.session.flush()
    log(issue.id, f'Reported by {u.name if u else "Anonymous"}')
    if urgency >= 8:
        log(issue.id, f'Flagged urgent — urgency {urgency}/10')
    db.session.commit()
    return jsonify(issue.to_dict()), 201

def get_authority(category, field):
    data = {
        'Pothole / Road Damage':     ('Municipal Corporation Roads Dept', '1800-110-0100', 'roads@municipal.gov.in'),
        'Garbage / Waste':           ('Municipal Corporation Sanitation', '1800-110-0200', 'sanitation@municipal.gov.in'),
        'Street Light Outage':       ('State Electricity Board',          '1912',           'electricity@municipal.gov.in'),
        'Flooding / Waterlogging':   ('Municipal Corporation Drainage',   '1800-110-0300', 'drainage@municipal.gov.in'),
        'Broken Infrastructure':     ('Municipal Corporation Roads Dept', '1800-110-0100', 'roads@municipal.gov.in'),
        'Vandalism / Graffiti':      ('Local Police Station',             '100',            'police@municipal.gov.in'),
        'Fallen Tree / Obstruction': ('Urban Development Authority',      '1800-110-0400', 'uda@municipal.gov.in'),
        'Damaged Public Property':   ('Municipal Corporation Parks Dept', '1800-110-0500', 'parks@municipal.gov.in'),
        'Other':                     ('Municipal Corporation',            '1800-110-0000', 'contact@municipal.gov.in'),
    }
    row = data.get(category, data['Other'])
    return row[{'name': 0, 'phone': 1, 'email': 2}[field]]

@app.route('/api/issues/<iid>/upvote', methods=['POST'])
def upvote(iid):
    issue = Issue.query.get_or_404(iid)
    issue.upvotes += 1
    log(issue.id, f'Upvoted ({issue.upvotes} total)')
    db.session.commit()
    return jsonify({'upvotes': issue.upvotes})

@app.route('/api/issues/<iid>/status', methods=['POST'])
def set_status(iid):
    issue = Issue.query.get_or_404(iid)
    d     = request.get_json(force=True) or {}
    old   = issue.status
    issue.status = d.get('status', issue.status)
    log(issue.id, f'Status: {old} → {issue.status}')
    db.session.commit()
    return jsonify(issue.to_dict())

# ── COMMENTS ─────────────────────────────────────────

@app.route('/api/issues/<iid>/comments', methods=['GET'])
def get_comments(iid):
    comments = Comment.query.filter_by(issue_id=iid).order_by(Comment.created_at).all()
    return jsonify([c.to_dict() for c in comments])

@app.route('/api/issues/<iid>/comments', methods=['POST'])
def add_comment(iid):
    Issue.query.get_or_404(iid)
    u    = current_user()
    d    = request.get_json(force=True) or {}
    text = d.get('text', '').strip()
    if not text:
        return jsonify({'error': 'Text required'}), 400
    c = Comment(issue_id=iid, user_id=u.id if u else None, text=text)
    db.session.add(c)
    log(iid, f'Comment by {u.name if u else "Anonymous"}')
    db.session.commit()
    return jsonify(c.to_dict()), 201

# ── ACTIVITY ─────────────────────────────────────────

@app.route('/api/issues/<iid>/activity', methods=['GET'])
def get_activity(iid):
    acts = Activity.query.filter_by(issue_id=iid).order_by(Activity.created_at).all()
    return jsonify([a.to_dict() for a in acts])

# ── STATS ────────────────────────────────────────────

@app.route('/api/stats', methods=['GET'])
def stats():
    total    = Issue.query.count()
    open_c   = Issue.query.filter_by(status='open').count()
    resolved = Issue.query.filter_by(status='resolved').count()
    urgent   = Issue.query.filter(Issue.urgency >= 7).count()
    cats     = db.session.query(Issue.category, db.func.count(Issue.id)).group_by(Issue.category).all()
    daily_map = {}
    for (dt,) in db.session.query(Issue.created_at).all():
        if dt:
            k = dt.strftime('%Y-%m-%d')
            daily_map[k] = daily_map.get(k, 0) + 1
    return jsonify({
        'total': total, 'open': open_c, 'resolved': resolved, 'urgent': urgent,
        'by_category': {c: n for c, n in cats},
        'daily': [{'date': k, 'count': v} for k, v in sorted(daily_map.items())],
    })

@app.route('/api/admin/issues', methods=['GET'])
def admin_issues():
    issues = Issue.query.order_by(Issue.urgency.desc(), Issue.created_at.desc()).all()
    return jsonify([i.to_dict() for i in issues])

@app.route('/uploads/<filename>')
def serve_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port)
