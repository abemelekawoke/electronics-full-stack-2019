from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.conf import settings
from .models import InternalOrder, NewInternalOrder
from orders.models import ExternalOrder, NewExternalOrder

def internal_order_receipt(request, pk):
    order = get_object_or_404(InternalOrder, pk=pk)
    order_items = NewInternalOrder.objects.filter(Internal_order=order)
    return generate_receipt_response(request, order, order_items, "Internal Order (የውስጥ ትዕዛዝ)")

def external_order_receipt(request, pk):
    order = get_object_or_404(ExternalOrder, pk=pk)
    order_items = NewExternalOrder.objects.filter(External_order=order)
    return generate_receipt_response(request, order, order_items, "External Order (የውጭ ትዕዛዝ)")

def generate_receipt_response(request, order, items, title):
    """
    Helper function to generate the HTML receipt for both internal and external orders.
    """
    header_logo_url = request.build_absolute_uri(settings.STATIC_URL + 'images/header_logo.jpg')
    footer_logo_url = request.build_absolute_uri(settings.STATIC_URL + 'images/footer_logo.jpg')

    # Logic to handle slightly different field names between models
    ordered_date = getattr(order, 'Ordered_date', 'N/A')
    total_price = getattr(order, 'Item_total_price', 0)
    paid = getattr(order, 'Price_paid', 0)
    remains = getattr(order, 'The_rest', 0)

    html_content = f'''
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8">
            <style>
                @page {{ size: 80mm auto; margin: 0; }}
                body {{ 
                    font-family: "Nyala", "Abyssinica SIL", "Noto Sans Ethiopic", Arial, sans-serif; 
                    margin: 0; padding: 0; width: 80mm; background-color: #fff; 
                }}
                .receipt-container {{ width: 74mm; padding: 0; margin: 0 auto; box-sizing: border-box; }}
                .header-img, .footer-img {{ width: 100%; height: auto; display: block; margin-bottom: 5px; }}
                h2, p {{ margin: 2px 0; text-align: center; font-size: 11px; }}
                .note {{ margin-bottom: 9px; font-size: 9px; }}
                .details, .items, .summary {{ font-size: 9px; margin-top: 2px; }}
                .items table {{ width: 100%; border-collapse: collapse; table-layout: fixed; }}
                .items th, .items td {{ padding: 2px 1px; text-align: left; font-size: 9px; overflow: hidden; }}
                .items th {{ font-weight: bold; border-bottom: 1px dashed #000; }}
                .col-num {{ width: 8%; }} .col-item {{ width: 40%; }} .col-qty {{ width: 12%; }} 
                .col-price {{ width: 20%; }} .col-total {{ width: 20%; }}
                .line {{ border-top: 1px dashed #000; margin: 5px 0; }}
                .footer {{ margin-top: 10px; margin-bottom: 120px; }}
                @media print {{
                    body * {{ visibility: hidden; }}
                    .receipt-container, .receipt-container * {{ visibility: visible; }}
                    .receipt-container {{ position: absolute; left: 0; top: 0; }}
                }}
            </style>
            <script>
                window.onload = function() {{
                    window.print();
                    window.onafterprint = function() {{ window.close(); }};
                }};
            </script>
        </head>
        <body>
            <div class="receipt-container">
                <div class="header">
                    <img src="{header_logo_url}" alt="Header" class="header-img">
                </div>
                
                <div class="note">
                    <p style="text-align: left;">Order No (ቁጥር): {order.pk}</p>
                    <p style="text-align: left;">Date (ቀን): {ordered_date}</p>
                </div>
                 
                <h2 style="text-align: center;">{title}</h2>
                
                <div class="details">
                    <p style="text-align: left;"><strong>Customer (ደንበኛ):</strong> {order.Customer_name}</p>
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
                                <td class="col-price">{getattr(item, 'Single_price', 0)}</td>
                                <td class="col-total">{getattr(item, 'Total_price', 0)}</td>
                            </tr>''' for index, item in enumerate(items))}
                        </tbody>
                    </table>
                </div>
                
                <div class="line"></div>
                
                <div class="summary" style="text-align: right;">
                    <p>Sub total (ድምር): {total_price}</p>
                    <p>Paid (የተከፈለ): {paid}</p>
                    <p><strong>Remains (ቀሪ): {remains}</strong></p>
                </div>
                
                <div class="line"></div>

                <div class="footer">
                    <img src="{footer_logo_url}" alt="Footer" class="footer-img">
                </div>
                <div class="extra">.</div>
            </div>
        </body>
    </html>
    '''
    return HttpResponse(html_content, content_type='text/html; charset=utf-8')