from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS
import secrets

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

app.config['SECRET_KEY'] = secrets.token_hex(16)
app.config['SESSION_COOKIE_NAME'] = 'test'
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_COOKIE_SECURE'] = False

print(app.config['SECRET_KEY'])

@app.before_request
def log_request():
    print(f"Incoming request: {request.method} {request.path}")

# Database configuration
config = {
    'user': 'root',
    'password': '',
    'host': '127.0.0.1',
    'database': 'kunduru',
    'raise_on_warnings': True
}

# Establish a database connection and create a cursor object.
def get_db_connection():
    conn = mysql.connector.connect(**config)
    return conn

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()

        # Assuming the emp_details table has the fields for login, you'd likely have a separate user table.
        query = "SELECT name FROM admin WHERE name=%s AND password=%s"  # Use the appropriate fields for login.
        cursor.execute(query, (data['name'], data['password']))

        result = cursor.fetchone()

        cursor.close()
        conn.close()

        if result:
            return jsonify({"success": True, "message": "Logged in!"})
        else:
            return jsonify({"success": False, "message": "Invalid credentials."})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})

@app.route('/dashboard', methods=['GET'])
def get_dashboard_data():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # Your SQL queries to fetch data from 'emp_att' or other relevant tables
    cursor.execute("SELECT * FROM emp_att")
    data = cursor.fetchall()

    cursor.close()
    conn.close()
    return jsonify(data)

@app.route('/add_employee', methods=['POST'])
def add_employee():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "INSERT INTO emp_details (emp_name, mobile, address, day_wage) VALUES (%s, %s, %s, %s)"
    cursor.execute(query, (data['emp_name'], data['mobile'], data['address'], data['day_wage']))
    
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"success": True, "message": "Employee added!"})

@app.route('/mark_attendance', methods=['POST'])
def mark_attendance():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if a record for the given emp_name and date already exists
    check_query = "SELECT * FROM emp_att WHERE emp_name = %s AND date = %s"
    cursor.execute(check_query, (data['emp_name'], data['date']))
    existing_record = cursor.fetchone()

    if existing_record:
        # Close database connections before returning
        cursor.close()
        conn.close()
        return jsonify({"success": False, "message": "Attendance has already been marked for this day!"})

    query = "INSERT INTO emp_att (emp_name, date, att_status) VALUES (%s, %s, %s)"
    cursor.execute(query, (data['emp_name'], data['date'], data['att_status']))
    
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"success": True, "message": "Attendance marked!"})


@app.route('/employees', methods=['GET'])
def get_employees():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM emp_details")
    data = cursor.fetchall()

    cursor.close()
    conn.close()
    return jsonify(data)

@app.route('/lend_details', methods=['POST'])
def lend_details():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "INSERT INTO lend_details (emp_name, amount, reason, date_took) VALUES (%s, %s, %s, %s)"
    cursor.execute(query, (data['emp_name'], data['amount'], data['reason'], data['date_took']))
    
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"success": True, "message": "Lending details uploaded!"})

@app.route('/get_lend_details', methods=['GET'])
def get_lend_details():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # Your SQL queries to fetch data from 'emp_att' or other relevant tables
    cursor.execute("SELECT * FROM lend_details")
    data = cursor.fetchall()

    cursor.close()
    conn.close()
    return jsonify(data)

@app.route('/transaction', methods=['POST'])
def transaction():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "INSERT INTO transactions (emp_name, Amount_sent, date_paid) VALUES (%s, %s, %s)"
    cursor.execute(query, (data['emp_name'], data['Amount_sent'], data['date_paid']))
    
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"success": True, "message": "Transaction recorded!"})

if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True)
