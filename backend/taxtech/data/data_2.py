
import json

# Define the data
data = [
    {
        "Name": "SOLAR STAR Australia Pty Ltd.",
        "Country": "Australia",
        "Currency": "$",
        "EBT": 3110804,
        "Taxes": 933287,
        "Revenues": 15019053,
        "Wages": 4462929,
        "Fixed Assets": 490842
    },
    {
        "Name": "Münchener Bau Peking Trading Co. Ltd.",
        "Country": "China",
        "Currency": "¥",
        "EBT": 2879422,
        "Taxes": 122634,
        "Revenues": 18531124,
        "Wages": 1287482,
        "Fixed Assets": 49983
    },
    {
        "Name": "SOLAR STAR Peking Co. Ltd.",
        "Country": "China",
        "Currency": "¥",
        "EBT": 3398064,
        "Taxes": 858188,
        "Revenues": 48629095,
        "Wages": 1791086,
        "Fixed Assets": 16620
    },
    {
        "Name": "SOLAR STAR Shenzhen Precision Tools Co. Ltd.",
        "Country": "China",
        "Currency": "¥",
        "EBT": 4890481,
        "Taxes": 1425081,
        "Revenues": 210938122,
        "Wages": 52355302,
        "Fixed Assets": 23675449
    },
    {
        "Name": "Helvetia STAR Nanjing Co. Ltd.",
        "Country": "China",
        "Currency": "¥",
        "EBT": 12736577,
        "Taxes": 3318591,
        "Revenues": 107841917,
        "Wages": 19877312,
        "Fixed Assets": 9181474
    },
    {
        "Name": "LASER FOCUS Solutions Ltd.",
        "Country": "China",
        "Currency": "¥",
        "EBT": 22933642,
        "Taxes": 8532294,
        "Revenues": 107007592,
        "Wages": 28371569,
        "Fixed Assets": 7684218
    },
    {
        "Name": "SOLAR STAR AG",
        "Country": "Germany",
        "Currency": "€",
        "EBT": -6257808,
        "Taxes": 25241000,
        "Revenues": 78373525,
        "Wages": 24276114,
        "Fixed Assets": 72113495
    },
    {
        "Name": "SOLAR STAR Techologien GmbH",
        "Country": "Germany",
        "Currency": "€",
        "EBT": -13750861,
        "Taxes": 1011699,
        "Revenues": 29458635,
        "Wages": 12183108,
        "Fixed Assets": 1563488
    },
    {
        "Name": "SOLAR STAR Industrial Solar Panel Germany GmbH",
        "Country": "Germany",
        "Currency": "€",
        "EBT": 2613482,
        "Taxes": -541593,
        "Revenues": 49003962,
        "Wages": 21250856,
        "Fixed Assets": 16304595
    },
    {
        "Name": "SOLAR STAR Technology GmbH",
        "Country": "Germany",
        "Currency": "€",
        "EBT": 86892900,
        "Taxes": 2203025,
        "Revenues": 406030404,
        "Wages": 101856077,
        "Fixed Assets": 71899050
    },
    {
        "Name": "SOLAR STAR Panel Industries GmbH",
        "Country": "Germany",
        "Currency": "€",
        "EBT": 6503237,
        "Taxes": 1011920,
        "Revenues": 69569294,
        "Wages": 24093966,
        "Fixed Assets": 7266301
    },
    {
        "Name": "LASER GmbH",
        "Country": "Germany",
        "Currency": "€",
        "EBT": 14553790,
        "Taxes": 1296192,
        "Revenues": 92341726,
        "Wages": 28630956,
        "Fixed Assets": 21589109
    },
    {
        "Name": "LASER Scandinavia Oy",
        "Country": "Finland",
        "Currency": "€",
        "EBT": -425655,
        "Taxes": 600,
        "Revenues": 294901,
        "Wages": 365941,
        "Fixed Assets": 71284
    },
    {
        "Name": "SOLAR STAR Industrial Solar Panel France SAS",
        "Country": "France",
        "Currency": "€",
        "EBT": 30126,
        "Taxes": 1267,
        "Revenues": 6691332,
        "Wages": 3044949,
        "Fixed Assets": 2837295
    },
    {
        "Name": "SOLAR STAR Flight Solutions UK Ltd.",
        "Country": "United Kingdom",
        "Currency": "£",
        "EBT": -1163011,
        "Taxes": -496500,
        "Revenues": 17802862,
        "Wages": 7638225,
        "Fixed Assets": 4926736
    },
    {
        "Name": "LASER Hong Kong Ltd.",
        "Country": "Hong Kong",
        "Currency": "HK$",
        "EBT": 9105693,
        "Taxes": 1354462,
        "Revenues": 142579492,
        "Wages": 0,
        "Fixed Assets": 0
    },
    {
        "Name": "SOLAR STAR Industrial Solar Panel India Private Ltd.",
        "Country": "India",
        "Currency": "₹",
        "EBT": 21728631,
        "Taxes": 4111624,
        "Revenues": 127793212,
        "Wages": 20120981,
        "Fixed Assets": 6955992
    },
    {
        "Name": "SOLAR STAR Tokio Co. Ltd.",
        "Country": "Japan",
        "Currency": "￥",
        "EBT": -15680825,
        "Taxes": -4315440,
        "Revenues": 630186879,
        "Wages": 106616937,
        "Fixed Assets": 23725837
    },
    {
        "Name": "LASER Kyoto Co. Ltd.",
        "Country": "Japan",
        "Currency": "￥",
        "EBT": 241224668,
        "Taxes": 83370716,
        "Revenues": 1207927931,
        "Wages": 151146587,
        "Fixed Assets": 125623816
    },
    {
        "Name": "SOLARTWO Consumer Ltd.",
        "Country": "Canada",
        "Currency": "$",
        "EBT": 11767002,
        "Taxes": 2666776,
        "Revenues": 74227540,
        "Wages": 20360137,
        "Fixed Assets": 6030437
    },
    {
        "Name": "SOLAR STAR Benelux B.V.",
        "Country": "Netherlands",
        "Currency": "€",
        "EBT": 804169,
        "Taxes": 163865,
        "Revenues": 3600132,
        "Wages": 792861,
        "Fixed Assets": 429649
    },
    {
        "Name": "SOLAR STAR Flight Solutions Switzerland AG",
        "Country": "Switzerland",
        "Currency": "CHF",
        "EBT": 371618,
        "Taxes": 62905,
        "Revenues": 5064940,
        "Wages": 964089,
        "Fixed Assets": 326595
    },
    {
        "Name": "Helvetia STAR AG",
        "Country": "Switzerland",
        "Currency": "CHF",
        "EBT": 14518851,
        "Taxes": 1934433,
        "Revenues": 113261403,
        "Wages": 44705919,
        "Fixed Assets": 29984629
    },
    {
        "Name": "SOLAR STAR Middle East-Asia-Pacific Pte. Ltd.",
        "Country": "Singapore",
        "Currency": "$",
        "EBT": -585661,
        "Taxes": 0,
        "Revenues": 2004397,
        "Wages": 415867,
        "Fixed Assets": 46753
    },
    {
        "Name": "LASER Singapore Pte. Ltd.",
        "Country": "Singapore",
        "Currency": "$",
        "EBT": 376199,
        "Taxes": 47124,
        "Revenues": 2334164,
        "Wages": 520424,
        "Fixed Assets": 49001
    },
    {
        "Name": "SOLAR STAR International S.L.",
        "Country": "Spain",
        "Currency": "€",
        "EBT": -9681319,
        "Taxes": 823250,
        "Revenues": 1071584,
        "Wages": 2543733,
        "Fixed Assets": 2516270
    },
    {
        "Name": "SOLAR STAR Seoul Corp. Ltd.",
        "Country": "South Korea",
        "Currency": "₩",
        "EBT": 544369794,
        "Taxes": 16250558,
        "Revenues": 6899230193,
        "Wages": 1110176335,
        "Fixed Assets": 28179496
    },
    {
        "Name": "LASER Seoul Co. Ltd.",
        "Country": "South Korea",
        "Currency": "₩",
        "EBT": 324790107,
        "Taxes": 43581880,
        "Revenues": 3468920376,
        "Wages": 1114736450,
        "Fixed Assets": 338538646
    },
    {
        "Name": "LASER Taipeh Ltd.",
        "Country": "Taiwan",
        "Currency": "$",
        "EBT": 27964294,
        "Taxes": 5647274,
        "Revenues": 173775171,
        "Wages": 21404306,
        "Fixed Assets": 13571150
    },
    {
        "Name": "SOLAR STAR North America Inc.",
        "Country": "USA",
        "Currency": "$",
        "EBT": -1528575,
        "Taxes": 1301266,
        "Revenues": 767515,
        "Wages": 0,
        "Fixed Assets": 0
    }
]

# Convert the data to JSON
json_data = json.dumps(data, indent=4)

# Write the JSON data to a file
with open('tax_data.json', 'w') as f:
    f.write(json_data)

'tax_data.json'
