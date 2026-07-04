import boto3
from botocore.config import Config
import traceback

def test_s3():
    endpoint = 'https://s3.hf.co/maftuh-main'
    access = 'HFAKMnZT5yr1qfbRyl6IpZha4pnW5GQ'
    secret = '24cbfa46f8605c7462d3530dafb64f636ac36d9810a786552204f28f52e46b8b'
    
    # 1. Path style with endpoint=https://s3.hf.co/maftuh-main
    try:
        s3 = boto3.client('s3', endpoint_url=endpoint, aws_access_key_id=access, aws_secret_access_key=secret, config=Config(s3={'addressing_style': 'path'}))
        s3.list_objects_v2(Bucket='wastra-yolov8-detector', MaxKeys=1)
        print("SUCCESS 1: Path style with Bucket='wastra-yolov8-detector' and endpoint='.../maftuh-main'")
        return
    except Exception as e:
        print("FAIL 1:", str(e))

    # 2. Virtual style with endpoint=https://s3.hf.co/maftuh-main
    try:
        s3 = boto3.client('s3', endpoint_url=endpoint, aws_access_key_id=access, aws_secret_access_key=secret, config=Config(s3={'addressing_style': 'virtual'}))
        s3.list_objects_v2(Bucket='wastra-yolov8-detector', MaxKeys=1)
        print("SUCCESS 2")
        return
    except Exception as e:
        print("FAIL 2:", str(e))

    # 3. Path style with endpoint=https://s3.hf.co
    try:
        s3 = boto3.client('s3', endpoint_url='https://s3.hf.co', aws_access_key_id=access, aws_secret_access_key=secret, config=Config(s3={'addressing_style': 'path'}))
        s3.list_objects_v2(Bucket='maftuh-main', Prefix='wastra-yolov8-detector/', MaxKeys=1)
        print("SUCCESS 3")
        return
    except Exception as e:
        print("FAIL 3:", str(e))

    # 4. Try the repo that definitely exists
    try:
        s3 = boto3.client('s3', endpoint_url=endpoint, aws_access_key_id=access, aws_secret_access_key=secret, config=Config(s3={'addressing_style': 'path'}))
        s3.list_objects_v2(Bucket='batik-generator-lora', MaxKeys=1)
        print("SUCCESS 4: Path style with Bucket='batik-generator-lora'")
        return
    except Exception as e:
        print("FAIL 4:", str(e))

if __name__ == "__main__":
    test_s3()
