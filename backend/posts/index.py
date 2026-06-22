import json
import os
import psycopg2

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    """Управление постами: GET — список, POST — создать, PUT — обновить"""
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    method = event.get('httpMethod', 'GET')

    if method == 'GET':
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("SELECT id, author, category, title, content, status, created_at FROM posts ORDER BY created_at DESC")
        rows = cur.fetchall()
        conn.close()
        posts = [
            {
                'id': r[0],
                'author': r[1],
                'category': r[2],
                'title': r[3],
                'content': r[4],
                'status': r[5],
                'date': r[6].strftime('%d.%m.%Y %H:%M') if r[6] else '',
            }
            for r in rows
        ]
        return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'posts': posts}, ensure_ascii=False)}

    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO posts (author, category, title, content, status) VALUES (%s, %s, %s, %s, 'published') RETURNING id, created_at",
            (body.get('author', 'Автор'), body['category'], body['title'], body['content'])
        )
        row = cur.fetchone()
        conn.commit()
        conn.close()
        return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'id': row[0]}, ensure_ascii=False)}

    if method == 'PUT':
        body = json.loads(event.get('body') or '{}')
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            "UPDATE posts SET author=%s, category=%s, title=%s, content=%s WHERE id=%s",
            (body.get('author', 'Автор'), body['category'], body['title'], body['content'], body['id'])
        )
        conn.commit()
        conn.close()
        return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'ok': True})}

    if method == 'DELETE':
        body = json.loads(event.get('body') or '{}')
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("DELETE FROM posts WHERE id=%s", (body['id'],))
        conn.commit()
        conn.close()
        return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'ok': True})}

    return {'statusCode': 405, 'headers': cors, 'body': 'Method not allowed'}
