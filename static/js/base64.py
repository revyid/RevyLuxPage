import base64

def js_to_base64(js_file_name):
    try:
        # Membaca file JavaScript
        with open(js_file_name, 'r') as js_file:
            js_content = js_file.read()
        
        # Mengubah konten JS ke Base64
        encoded_js = base64.b64encode(js_content.encode('utf-8')).decode('utf-8')
        
        # Membuat nama file output dengan format {namajs}_base64.js
        output_file_name = f"{js_file_name.split('.')[0]}_base64.js"
        
        # Menulis file Base64 ke file baru
        with open(output_file_name, 'w') as output_file:
            output_file.write(f"var encodedScript = '{encoded_js}';\n")
            output_file.write("var decodedScript = atob(encodedScript);\n")
            output_file.write("eval(decodedScript); // Menjalankan skrip yang sudah didekode\n")
        
        print(f"File berhasil diubah menjadi {output_file_name}")
    
    except FileNotFoundError:
        print(f"File {js_file_name} tidak ditemukan. Pastikan nama file benar.")
    except Exception as e:
        print(f"Terjadi kesalahan: {e}")

# Meminta input nama file JavaScript dari pengguna
js_file_name = input("Masukkan nama file JavaScript (misalnya script.js): ")

# Memanggil fungsi untuk mengubah JS menjadi Base64
js_to_base64(js_file_name)
