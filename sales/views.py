from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.conf import settings
from .models import Sale, NewSale
# Note: Removed duplicate import 'from sales.models' as it conflicts with '.models'

def sale_receipt(request, pk):
    sale = get_object_or_404(Sale, pk=pk)
    order_items = NewSale.objects.filter(sale=sale)

    # header_logo_url = request.build_absolute_uri(settings.STATIC_URL + '/static/images/header_logo.jpg')
    # footer_logo_url = request.build_absolute_uri(settings.STATIC_URL + '/static/images/footer_logo.jpg')
    
    header_logo_url = request.build_absolute_uri(settings.STATIC_URL + 'images/header_logo.jpg')
    footer_logo_url = request.build_absolute_uri(settings.STATIC_URL + 'images/footer_logo.jpg')

    html_content = f'''
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8">
            <style>
                @page {{
                    size: 80mm auto;
                    margin: 0;
                }}
                body {{ 
                    /* Added Amharic-friendly font stack */
                    font-family: "Nyala", "Abyssinica SIL", "Noto Sans Ethiopic", Arial, sans-serif; 
                    margin: 0; 
                    padding: 0; 
                    width: 80mm;
                    background-color: #fff; 
                    -webkit-print-color-adjust: exact;
                }}
                .receipt-container {{ 
                    width: 74mm;
                    padding: 0;
                    margin: 0 auto;
                    box-sizing: border-box;
                }}
                .header-img, .footer-img {{
                    width: 100%;
                    height: auto;
                    display: block;
                    margin-bottom: 5px;
                }}
                h2, p {{ 
                    margin: 2px 0; 
                    text-align: center; 
                    font-size: 11px; /* Slightly increased for better Amharic readability */
                }}
                .note {{
                    margin-bottom: 9px;
                    font-size: 9px;
                }}
                .details, .items, .summary {{ 
                    font-size: 9px;
                    margin-top: 2px;
                }}
                .items table {{ 
                    width: 100%; 
                    border-collapse: collapse; 
                    table-layout: fixed; 
                }}
                .items th, .items td {{ 
                    padding: 2px 1px; 
                    text-align: left; 
                    font-size: 9px; 
                    overflow: hidden;
                    /* Removed white-space: nowrap to allow Amharic items to wrap if needed */
                }}
                .items th {{ 
                    font-weight: bold; 
                    border-bottom: 1px dashed #000;
                }}
                .col-num {{ width: 8%; }}
                .col-item {{ width: 40%; }}
                .col-qty {{ width: 12%; }}
                .col-price {{ width: 20%; }}
                .col-total {{ width: 20%; }}

                .line {{ 
                    border-top: 1px dashed #000; 
                    margin: 5px 0; 
                }}
                .footer {{ 
                    margin-top: 10px;
                    margin-bottom: 120px; 
                }}
                @media print {{
                    body * {{ visibility: hidden; }}
                    .receipt-container, .receipt-container * {{ visibility: visible; }}
                    .receipt-container {{ position: absolute; left: 0; top: 0; }}
                }}
            </style>
            <script>
                window.onload = function() {{
                    window.print();
                    window.onafterprint = function() {{
                        window.close();
                    }};
                }};
            </script>
        </head>
        <body>
            <div class="receipt-container">
                <div class="header">
                    <img src="{header_logo_url}" alt="Header Logo" class="header-img">
                </div>
                
                <div class="note">
                    <p style="text-align: left;">Order No (ቁጥር): {sale.pk}</p>
                    <p style="text-align: left;">Date (ቀን): {sale.Sold_date}</p>
                </div>
                 
                <h2 style="text-align: center;">የሽያጭ ደረሰኝ (Sales Invoice)</h2>
                
                <div class="details">
                    <p style="text-align: left;"><strong>Customer (ደንበኛ):</strong> {sale.Customer_name}</p>
                </div>
                
                <div class="line"></div>

                <div class="items">
                    <table>
                        <thead>
                            <tr>
                                <th class="col-num">#</th>
                                <th class="col-item">Item</th>
                                <th class="col-qty">Qty</th>
                                <th class="col-price">Price</th>
                                <th class="col-total">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {''.join(f'''
                            <tr>
                                <td class="col-num">{index + 1}</td>
                                <td class="col-item">{item.Item_category} {item.Item_type}</td>
                                <td class="col-qty">{item.Quantity}</td>
                                <td class="col-price">{item.Sale_single_price}</td>
                                <td class="col-total">{item.Sale_total_price}</td>
                            </tr>''' for index, item in enumerate(order_items))}
                        </tbody>
                    </table>
                </div>
                
                <div class="line"></div>
                
                <div class="summary" style="text-align: right;">
                    <p>Sub total: {sale.Total}</p>
                    <p>Discount: 0.00</p>
                    <p><strong>Total (ጠቅላላ): {sale.Total}</strong></p>
                </div>
                
                <div class="line"></div>

                <div class="footer">
                    <img src="{footer_logo_url}" alt="Footer Logo" class="footer-img">
                </div>
                <div class="extra">.</div>
            </div>
        </body>
    </html>
    '''
    
    return HttpResponse(html_content, content_type='text/html; charset=utf-8')