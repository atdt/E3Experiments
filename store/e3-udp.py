# -*- coding: utf-8 -*-
"""
    e3-udp
    Log UDP events to MySQL

    @file
    @author Ori Livneh
"""
from datetime import datetime
import logging
import socket
import sys

from sqlalchemy import *
from sqlalchemy.orm import *
from sqlalchemy.ext.declarative import declarative_base


# UDP 
UDP = ('127.0.0.1', 514)

# Logging
logging.basicConfig(level=logging.INFO)

# Database
Base = declarative_base()
Session = sessionmaker()


class Record(Base):
    __tablename__ = 'e3'
    id = Column(BigInteger, primary_key=True)
    event = Column(String(128))
    auth = Column(Boolean)
    token = Column(String(128))
    prefix = Column(String(128))
    time = Column(DateTime)
    
    cols = ('prefix', 'event', 'timestamp', 'auth', 'token')

    def __repr__(self):
        return "<Record: %s %s>" % (self.event, self.token)

    def __init__(self, raw):
        raw = raw.split()
        fields = dict(zip(self.cols, raw))
        timestamp = fields.pop('timestamp')
        self.time = datetime.strptime(timestamp, '%Y%m%d%H%M%S')
        self.__dict__.update(fields)


def iter_data():
    """Generator; yields UDP records as they come in"""
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1) # TIME_WAIT
    sock.bind(udp)

    while True:
        data, addr = sock.recvfrom(65507)
        yield data

def listen():
    """Listen for incoming records and log them to the DB"""
    session = Session(autocommit=True)
    for data in iter_data():
        record = Record(data)
        session.add(record)
        logging.info('Event: ', record)

def parse_args(args=None):
    """Parse command-line arguments"""
    parser = argparse.ArgumentParser(description='e3-udp')

    parser.add_argument('user')
    parser.add_argument('password')

    return parser.parse_args(args)

def main():
    args = parse_args()

    # Set up the database connection and bind to relevant objects
    engine = create_engine('mysql://%(user)s:%(pass)s@localhost/e3' % args)
    Session.configure(bind=engine)
    Base.metadata.bind = engine
    Base.metadata.create_all()

    logging.info('Listening on udp://%s:%s...' % UDP )
    listen()

if __name__ == '__main__':
    main()
