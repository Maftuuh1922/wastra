from gradio_client import Client, handle_file

try:
    client = Client("maftuh-main/wastra-yolo-gradio")
    print("Connected to Gradio!")
    
    result = client.predict(
        image=handle_file("c:/Users/Administrator/wastra/test_image.png"),
        api_name="/predict"
    )
    print("Result:", result)
except Exception as e:
    print("Error:", e)
