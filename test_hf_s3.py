import boto3

s3 = boto3.client(
    's3',
    endpoint_url='https://s3.hf.co',
    aws_access_key_id='HFAKMnZT5yr1qfbRyl6IpZha4pnW5GQ',
    aws_secret_access_key='24cbfa46f8605c7462d3530dafb64f636ac36d9810a786552204f28f52e46b8b',
    region_name='us-east-1'
)

# Test different bucket names
for bucket in ['wastra-yolov8-detector', 'maftuh-main', 'maftuh-main/wastra-yolov8-detector', 'maftuh-main--wastra-yolov8-detector']:
    try:
        print(f"Trying bucket: {bucket}")
        response = s3.list_objects_v2(Bucket=bucket, MaxKeys=1)
        print(f"Success! Bucket is {bucket}")
    except Exception as e:
        print(f"Failed: {e}")
