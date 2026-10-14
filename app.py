from flask import Flask, render_template, send_from_directory
from pathlib import Path

app = Flask(__name__)

@app.get('/')
def home():
    return render_template('index.html')

@app.get('/favicon.ico')
def favicon():
    return send_from_directory(Path(app.root_path) / 'static' / 'images', 'favicon.png', mimetype='image/png')

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000)
