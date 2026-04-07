import sys, hashlib, secrets, random
sys.path.insert(0, '.')
from app import app, db, User, Issue, Activity
from datetime import datetime, timedelta

ISSUES = [
    {
        'title': 'Large pothole near bus stop causing accidents',
        'description': 'A large pothole has formed near the main bus stop. Multiple vehicles have been damaged. Needs urgent repair.',
        'category': 'Pothole / Road Damage',
        'urgency': 8, 'upvotes': 14, 'status': 'open',
        'lat': 25.5941, 'lng': 85.1376, 'address': 'Gandhi Maidan, Patna',
        'image_url': 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Road_pothole.jpg',
        'authority_name': 'Patna Municipal Corporation - Roads Dept',
        'authority_phone': '0612-2950100',
        'authority_email': 'roads@patnamunicipal.gov.in',
    },
    {
        'title': 'Garbage pile not collected for 5 days',
        'description': 'Garbage has been piling up for over 5 days near the market. Foul smell and health hazard.',
        'category': 'Garbage / Waste',
        'urgency': 6, 'upvotes': 8, 'status': 'open',
        'lat': 25.6093, 'lng': 85.1263, 'address': 'Boring Road, Patna',
        'image_url': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Litter_in_Indonesia.jpg/640px-Litter_in_Indonesia.jpg',
        'authority_name': 'Patna Municipal Corporation - Sanitation',
        'authority_phone': '0612-2950200',
        'authority_email': 'sanitation@patnamunicipal.gov.in',
    },
    {
        'title': 'Streetlight broken for 2 weeks near school',
        'description': 'Streetlight near the school has been non-functional for 2 weeks. Very dangerous at night.',
        'category': 'Street Light Outage',
        'urgency': 9, 'upvotes': 22, 'status': 'in_progress',
        'lat': 25.5784, 'lng': 85.1410, 'address': 'Kankarbagh, Patna',
        'image_url': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Broken_Street_Light.jpg/480px-Broken_Street_Light.jpg',
        'authority_name': 'BSPHCL - Bihar State Power',
        'authority_phone': '1912',
        'authority_email': 'complaints@bsphcl.co.in',
    },
    {
        'title': 'Waterlogging after rain blocks entire road',
        'description': 'After every rain the road gets completely waterlogged. Drainage system is blocked.',
        'category': 'Flooding / Waterlogging',
        'urgency': 7, 'upvotes': 18, 'status': 'open',
        'lat': 25.6040, 'lng': 85.1552, 'address': 'Rajendra Nagar, Patna',
        'image_url': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/2017_Mumbai_floods.jpg/640px-2017_Mumbai_floods.jpg',
        'authority_name': 'Patna Municipal Corporation - Drainage',
        'authority_phone': '0612-2950300',
        'authority_email': 'drainage@patnamunicipal.gov.in',
    },
    {
        'title': 'Tree fallen blocking main road completely',
        'description': 'A large tree has fallen across the road blocking all traffic. Emergency clearance needed.',
        'category': 'Fallen Tree / Obstruction',
        'urgency': 9, 'upvotes': 30, 'status': 'resolved',
        'lat': 25.5857, 'lng': 85.1300, 'address': 'Ashok Rajpath, Patna',
        'image_url': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Tree_fallen_across_road.jpg/640px-Tree_fallen_across_road.jpg',
        'authority_name': 'Patna Urban Development Authority',
        'authority_phone': '0612-2950400',
        'authority_email': 'puda@bihar.gov.in',
    },
    {
        'title': 'Broken park bench with sharp edges',
        'description': 'Park bench has broken and sharp metal edges are exposed. Risk of injury to children.',
        'category': 'Damaged Public Property',
        'urgency': 3, 'upvotes': 5, 'status': 'open',
        'lat': 25.6120, 'lng': 85.1490, 'address': 'Eco Park, Patna',
        'image_url': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Broken_bench.jpg/480px-Broken_bench.jpg',
        'authority_name': 'Patna Municipal Corporation - Parks',
        'authority_phone': '0612-2950500',
        'authority_email': 'parks@patnamunicipal.gov.in',
    },
    {
        'title': 'Graffiti on school boundary wall',
        'description': 'Obscene graffiti painted on the school boundary wall. Needs removal immediately.',
        'category': 'Vandalism / Graffiti',
        'urgency': 4, 'upvotes': 3, 'status': 'open',
        'lat': 25.5910, 'lng': 85.1600, 'address': 'Patna City',
        'image_url': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Graffiti_in_Shoreditch%2C_London_-_Zabou_%289608558316%29.jpg/640px-Graffiti_in_Shoreditch%2C_London_-_Zabou_%289608558316%29.jpg',
        'authority_name': 'Patna Police - Local Station',
        'authority_phone': '0612-2201009',
        'authority_email': 'patnapolice@bihar.gov.in',
    },
    {
        'title': 'Deep road crack near hospital entrance',
        'description': 'Large crack on the road near hospital main entrance. Ambulances having difficulty.',
        'category': 'Broken Infrastructure',
        'urgency': 8, 'upvotes': 25, 'status': 'in_progress',
        'lat': 25.6000, 'lng': 85.1440, 'address': 'PMCH Road, Patna',
        'image_url': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Road_deterioration.jpg/640px-Road_deterioration.jpg',
        'authority_name': 'Patna Municipal Corporation - Roads Dept',
        'authority_phone': '0612-2950100',
        'authority_email': 'roads@patnamunicipal.gov.in',
    },
]

with app.app_context():
    db.create_all()

    # Create admin user
    if not User.query.filter_by(email='admin@fixmycity.com').first():
        admin = User(
            name='Admin Officer',
            email='admin@fixmycity.com',
            password=hashlib.sha256('admin123'.encode()).hexdigest(),
            role='admin',
            city='Patna',
            token=secrets.token_hex(32),
        )
        db.session.add(admin)
        print('✓ Admin created — email: admin@fixmycity.com | password: admin123')

    # Add demo issues only if none exist
    if Issue.query.count() == 0:
        for data in ISSUES:
            issue = Issue(
                title           = data['title'],
                description     = data['description'],
                category        = data['category'],
                urgency         = data['urgency'],
                lat             = data['lat'] + random.uniform(-0.002, 0.002),
                lng             = data['lng'] + random.uniform(-0.002, 0.002),
                address         = data['address'],
                image_url       = data['image_url'],
                upvotes         = data['upvotes'],
                status          = data['status'],
                authority_name  = data['authority_name'],
                authority_phone = data['authority_phone'],
                authority_email = data['authority_email'],
                created_at      = datetime.utcnow() - timedelta(days=random.randint(1, 14)),
            )
            db.session.add(issue)
            db.session.flush()
            db.session.add(Activity(issue_id=issue.id, action='Issue reported by citizen'))
            if data['urgency'] >= 8:
                db.session.add(Activity(issue_id=issue.id, action=f'Flagged urgent — urgency {data["urgency"]}/10'))
            if data['status'] == 'in_progress':
                db.session.add(Activity(issue_id=issue.id, action='Status: open → in_progress'))
            if data['status'] == 'resolved':
                db.session.add(Activity(issue_id=issue.id, action='Status: open → in_progress'))
                db.session.add(Activity(issue_id=issue.id, action='Status: in_progress → resolved'))

        db.session.commit()
        print(f'✓ Added {len(ISSUES)} demo issues with images and authority contacts')
    else:
        db.session.commit()
        print(f'ℹ Issues already exist — skipping demo data. Delete fixmycity.db to reset.')

    print('\nReady! Open http://localhost:3000')
