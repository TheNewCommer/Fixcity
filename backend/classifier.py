CATEGORY_MAP = {
    'pothole': 'Pothole / Road Damage', 'road': 'Pothole / Road Damage',
    'garbage': 'Garbage / Waste', 'trash': 'Garbage / Waste', 'waste': 'Garbage / Waste',
    'light': 'Street Light Outage', 'lamp': 'Street Light Outage',
    'flood': 'Flooding / Waterlogging', 'water': 'Flooding / Waterlogging',
    'crack': 'Broken Infrastructure', 'broken': 'Broken Infrastructure',
    'graffiti': 'Vandalism / Graffiti', 'spray': 'Vandalism / Graffiti',
    'tree': 'Fallen Tree / Obstruction', 'branch': 'Fallen Tree / Obstruction',
    'bench': 'Damaged Public Property', 'park': 'Damaged Public Property',
}
URGENCY_MAP = {
    'Pothole / Road Damage': 7, 'Garbage / Waste': 6,
    'Street Light Outage': 8, 'Flooding / Waterlogging': 9,
    'Broken Infrastructure': 7, 'Vandalism / Graffiti': 4,
    'Fallen Tree / Obstruction': 8, 'Damaged Public Property': 5, 'Other': 5,
}
TITLE_MAP = {
    'Pothole / Road Damage': 'Pothole reported on road',
    'Garbage / Waste': 'Garbage dumping spotted',
    'Street Light Outage': 'Street light not working',
    'Flooding / Waterlogging': 'Waterlogging / flooding issue',
    'Broken Infrastructure': 'Broken infrastructure spotted',
    'Vandalism / Graffiti': 'Graffiti / vandalism reported',
    'Fallen Tree / Obstruction': 'Fallen tree blocking path',
    'Damaged Public Property': 'Damaged public property',
    'Other': 'Civic issue reported',
}

def classify_image(image_path):
    try:
        from transformers import pipeline
        from PIL import Image
        clf = pipeline('image-classification', model='google/vit-base-patch16-224', top_k=10)
        img = Image.open(image_path).convert('RGB')
        results = clf(img)
        for r in results:
            label = r['label'].lower()
            for kw, cat in CATEGORY_MAP.items():
                if kw in label:
                    return {'category': cat, 'urgency': URGENCY_MAP[cat], 'suggested_title': TITLE_MAP[cat]}
    except Exception as e:
        print(f'[Classifier] Using fallback: {e}')
    lower = image_path.lower()
    for kw, cat in CATEGORY_MAP.items():
        if kw in lower:
            return {'category': cat, 'urgency': URGENCY_MAP[cat], 'suggested_title': TITLE_MAP[cat]}
    return {'category': 'Other', 'urgency': 5, 'suggested_title': 'Civic issue reported'}
