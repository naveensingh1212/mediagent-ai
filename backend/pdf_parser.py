# steps to read pdf
#step 1 open the pdf from folder
#step 2 select the header/ page which needed to read
#step 3 highlight important part
#step 4 bookmark or close the pdf 

import fitz

def extract_text_from_pdf(pdf_path):
    all_text=""
    document = fitz.open(pdf_path)
    for page in document:
        text=page.get_text()
        all_text = all_text+text
    return all_text

result = extract_text_from_pdf("sample/medical-lab-report-format-pdf.pdf")
print(result)