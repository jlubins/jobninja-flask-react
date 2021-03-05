from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS, cross_origin
from flask_marshmallow import Marshmallow
from flask import request
import os

from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
app.config.from_object(os.getenv('APP_SETTINGS'))
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
ma = Marshmallow(app)
migrate = Migrate(app, db)
CORS(app)


class Record(db.Model):
    __tablename__ = 'records'

    id = db.Column(db.Integer(), primary_key=True)
    firma = db.Column(db.String())
    titel = db.Column(db.String())
    job_id = db.Column(db.String())
    volltext = db.Column(db.String())
    plz_arbeitsort = db.Column(db.Integer())
    arbeitsort = db.Column(db.String())
    vondatum = db.Column(db.String())
    stellenlink = db.Column(db.String())
    jobtype = db.Column(db.String())
    category = db.Column(db.String())

    def __init__(self, id, firma, titel, job_id, volltext, plz_arbeitsort, arbeitsort, vondatum, stellenlink, jobtype, category):
        self.id = id
        self.firma = firma
        self.titel = titel
        self.job_id = job_id
        self.volltext = volltext
        self.plz_arbeitsort = plz_arbeitsort
        self.arbeitsort = arbeitsort
        self.vondatum = vondatum
        self.stellenlink = stellenlink
        self.jobtype = jobtype
        self.category = category

    def __repr__(self):
        return '<id {}>'.format(self.id)


class RecordSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Record
        load_instance = True


@app.route('/hello')
def hello():

    res = Record.query.all()
    record_schema = RecordSchema(many=True)
    output = record_schema.dump(res)

    res_json = jsonify({'record': output})

    return res_json


@app.route('/load')
def load():

    first = int(request.args.get('first'))
    last = first + 20
    res = Record.query[first:last]
    record_schema = RecordSchema(many=True)
    output = record_schema.dump(res)

    res_json = jsonify({'record': output})

    return res_json


@app.route('/get_last_entry_id')
def get_last():
    res = Record.query.order_by(-Record.id).first()
    record_schema = RecordSchema()
    output = record_schema.dump(res)

    print(output)

    res_json = jsonify({'last_entry_id': output['id']})
    return res_json


@app.route('/search')
def search():
    search_query = (request.args.get('query'))
    search_format = "%{}%".format(search_query)
    res = Record.query.filter(Record.volltext.like(search_format))[0:20]

    record_schema_many = RecordSchema(many=True)
    output = record_schema_many.dump(res)
    res_json = jsonify({'record': output})
    return res_json


if __name__ == '__main__':
    app.run()
