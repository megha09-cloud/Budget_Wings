// Airport reference data (Airport entity). Format: CODE|City|Airport name[|Display label]
// Lines starting with "#" set the country for the lines below. Order = importance (first airport of a city is the one picked for that city).
export const RAW = `
# India
DEL|Delhi|Indira Gandhi International Airport
BOM|Mumbai|Chhatrapati Shivaji Maharaj International Airport
BLR|Bengaluru|Kempegowda International Airport
MAA|Chennai|Chennai International Airport
HYD|Hyderabad|Rajiv Gandhi International Airport
CCU|Kolkata|Netaji Subhas Chandra Bose International Airport
AMD|Ahmedabad|Sardar Vallabhbhai Patel International Airport
GOI|Goa|Dabolim Airport|Goa Dabolim
GOX|Goa|Manohar International Airport (Mopa)|Goa Mopa
PNQ|Pune|Pune Airport
COK|Kochi|Cochin International Airport
JAI|Jaipur|Jaipur International Airport
LKO|Lucknow|Chaudhary Charan Singh International Airport
GAU|Guwahati|Lokpriya Gopinath Bordoloi International Airport
PAT|Patna|Jay Prakash Narayan Airport
IXC|Chandigarh|Chandigarh International Airport
ATQ|Amritsar|Sri Guru Ram Dass Jee International Airport
SXR|Srinagar|Sheikh ul-Alam International Airport
IXJ|Jammu|Jammu Airport
TRV|Thiruvananthapuram|Trivandrum International Airport
BBI|Bhubaneswar|Biju Patnaik International Airport
IDR|Indore|Devi Ahilya Bai Holkar Airport
NAG|Nagpur|Dr. Babasaheb Ambedkar International Airport
VNS|Varanasi|Lal Bahadur Shastri International Airport
CJB|Coimbatore|Coimbatore International Airport
IXM|Madurai|Madurai Airport
TRZ|Tiruchirappalli|Tiruchirappalli International Airport
IXE|Mangaluru|Mangaluru International Airport
CCJ|Kozhikode|Calicut International Airport
VGA|Vijayawada|Vijayawada Airport
VTZ|Visakhapatnam|Visakhapatnam Airport
RPR|Raipur|Swami Vivekananda Airport
IXR|Ranchi|Birsa Munda Airport
BHO|Bhopal|Raja Bhoj Airport
UDR|Udaipur|Maharana Pratap Airport
JDH|Jodhpur|Jodhpur Airport
DED|Dehradun|Jolly Grant Airport
IXL|Leh|Kushok Bakula Rimpoche Airport
IMF|Imphal|Imphal International Airport
AGR|Agra|Agra Airport
GWL|Gwalior|Gwalior Airport
JLR|Jabalpur|Jabalpur Airport
HBX|Hubballi|Hubli Airport
IXG|Belagavi|Belgaum Airport
IXB|Bagdogra|Bagdogra Airport
IXA|Agartala|Agartala Airport
DIB|Dibrugarh|Dibrugarh Airport
IXZ|Port Blair|Veer Savarkar International Airport
GAY|Gaya|Gaya Airport
BDQ|Vadodara|Vadodara Airport
STV|Surat|Surat Airport
IXD|Prayagraj|Prayagraj Airport
AYJ|Ayodhya|Maharishi Valmiki International Airport
DHM|Dharamshala|Kangra Airport
KUU|Kullu|Bhuntar Airport
TIR|Tirupati|Tirupati Airport
# United Arab Emirates
DXB|Dubai|Dubai International Airport
AUH|Abu Dhabi|Zayed International Airport
SHJ|Sharjah|Sharjah International Airport
DWC|Dubai|Al Maktoum International Airport|Dubai Al Maktoum
# Qatar
DOH|Doha|Hamad International Airport
# Bahrain
BAH|Manama|Bahrain International Airport|Bahrain
# Kuwait
KWI|Kuwait City|Kuwait International Airport
# Oman
MCT|Muscat|Muscat International Airport
# Saudi Arabia
RUH|Riyadh|King Khalid International Airport
JED|Jeddah|King Abdulaziz International Airport
DMM|Dammam|King Fahd International Airport
MED|Medina|Prince Mohammad bin Abdulaziz International Airport
# Jordan
AMM|Amman|Queen Alia International Airport
# Israel
TLV|Tel Aviv|Ben Gurion Airport
# Lebanon
BEY|Beirut|Beirut-Rafic Hariri International Airport
# Turkey
IST|Istanbul|Istanbul Airport|Istanbul
SAW|Istanbul|Sabiha Gokcen International Airport|Istanbul Sabiha Gokcen
AYT|Antalya|Antalya Airport
# Iran
THR|Tehran|Imam Khomeini International Airport
# Singapore
SIN|Singapore|Changi Airport
# Thailand
BKK|Bangkok|Suvarnabhumi Airport|Bangkok Suvarnabhumi
DMK|Bangkok|Don Mueang International Airport|Bangkok Don Mueang
HKT|Phuket|Phuket International Airport
CNX|Chiang Mai|Chiang Mai International Airport
# Malaysia
KUL|Kuala Lumpur|Kuala Lumpur International Airport
PEN|Penang|Penang International Airport
# Indonesia
CGK|Jakarta|Soekarno-Hatta International Airport
DPS|Bali|Ngurah Rai International Airport|Bali Denpasar
# Philippines
MNL|Manila|Ninoy Aquino International Airport
CEB|Cebu|Mactan-Cebu International Airport
# Vietnam
SGN|Ho Chi Minh City|Tan Son Nhat International Airport
HAN|Hanoi|Noi Bai International Airport
DAD|Da Nang|Da Nang International Airport
# Cambodia
PNH|Phnom Penh|Phnom Penh International Airport
REP|Siem Reap|Siem Reap-Angkor International Airport
# Myanmar
RGN|Yangon|Yangon International Airport
# Hong Kong
HKG|Hong Kong|Hong Kong International Airport
# Macau
MFM|Macau|Macau International Airport
# Taiwan
TPE|Taipei|Taiwan Taoyuan International Airport
# China
PEK|Beijing|Beijing Capital International Airport|Beijing Capital
PKX|Beijing|Beijing Daxing International Airport|Beijing Daxing
PVG|Shanghai|Shanghai Pudong International Airport|Shanghai Pudong
SHA|Shanghai|Shanghai Hongqiao International Airport|Shanghai Hongqiao
CAN|Guangzhou|Guangzhou Baiyun International Airport
SZX|Shenzhen|Shenzhen Bao'an International Airport
CTU|Chengdu|Chengdu Shuangliu International Airport
# Japan
HND|Tokyo|Haneda Airport|Tokyo Haneda
NRT|Tokyo|Narita International Airport|Tokyo Narita
KIX|Osaka|Kansai International Airport
# South Korea
ICN|Seoul|Incheon International Airport|Seoul Incheon
GMP|Seoul|Gimpo International Airport|Seoul Gimpo
PUS|Busan|Gimhae International Airport
# Nepal
KTM|Kathmandu|Tribhuvan International Airport
# Sri Lanka
CMB|Colombo|Bandaranaike International Airport
# Bangladesh
DAC|Dhaka|Hazrat Shahjalal International Airport
# Maldives
MLE|Male|Velana International Airport
# Bhutan
PBH|Paro|Paro International Airport
# Pakistan
ISB|Islamabad|Islamabad International Airport
KHI|Karachi|Jinnah International Airport
LHE|Lahore|Allama Iqbal International Airport
# Afghanistan
KBL|Kabul|Hamid Karzai International Airport
# Uzbekistan
TAS|Tashkent|Islam Karimov Tashkent International Airport
# Kazakhstan
ALA|Almaty|Almaty International Airport
# Mongolia
ULN|Ulaanbaatar|Chinggis Khaan International Airport
# United Kingdom
LHR|London|Heathrow Airport|London Heathrow
LGW|London|Gatwick Airport|London Gatwick
STN|London|Stansted Airport|London Stansted
LTN|London|Luton Airport|London Luton
LCY|London|London City Airport|London City
MAN|Manchester|Manchester Airport
BHX|Birmingham|Birmingham Airport
EDI|Edinburgh|Edinburgh Airport
GLA|Glasgow|Glasgow Airport
# Ireland
DUB|Dublin|Dublin Airport
# France
CDG|Paris|Charles de Gaulle Airport|Paris Charles de Gaulle
ORY|Paris|Orly Airport|Paris Orly
NCE|Nice|Nice Cote d'Azur Airport
LYS|Lyon|Lyon-Saint-Exupery Airport
MRS|Marseille|Marseille Provence Airport
# Germany
FRA|Frankfurt|Frankfurt Airport
MUC|Munich|Munich Airport
BER|Berlin|Berlin Brandenburg Airport
DUS|Dusseldorf|Dusseldorf Airport
HAM|Hamburg|Hamburg Airport
# Netherlands
AMS|Amsterdam|Schiphol Airport
# Belgium
BRU|Brussels|Brussels Airport
# Switzerland
ZRH|Zurich|Zurich Airport
GVA|Geneva|Geneva Airport
# Austria
VIE|Vienna|Vienna International Airport
# Italy
FCO|Rome|Leonardo da Vinci-Fiumicino Airport|Rome Fiumicino
MXP|Milan|Malpensa Airport|Milan Malpensa
VCE|Venice|Marco Polo Airport
NAP|Naples|Naples International Airport
# Spain
MAD|Madrid|Adolfo Suarez Madrid-Barajas Airport
BCN|Barcelona|Barcelona-El Prat Airport
AGP|Malaga|Malaga Airport
# Portugal
LIS|Lisbon|Humberto Delgado Airport
OPO|Porto|Francisco Sa Carneiro Airport
# Greece
ATH|Athens|Athens International Airport
# Denmark
CPH|Copenhagen|Copenhagen Airport
# Sweden
ARN|Stockholm|Arlanda Airport
# Norway
OSL|Oslo|Oslo Airport
# Finland
HEL|Helsinki|Helsinki Airport
# Iceland
KEF|Reykjavik|Keflavik International Airport
# Poland
WAW|Warsaw|Chopin Airport
# Czech Republic
PRG|Prague|Vaclav Havel Airport Prague
# Hungary
BUD|Budapest|Budapest Ferenc Liszt International Airport
# Romania
OTP|Bucharest|Henri Coanda International Airport
# Russia
SVO|Moscow|Sheremetyevo International Airport|Moscow Sheremetyevo
DME|Moscow|Domodedovo International Airport|Moscow Domodedovo
LED|Saint Petersburg|Pulkovo Airport
# United States
JFK|New York|John F. Kennedy International Airport|New York JFK
EWR|New York|Newark Liberty International Airport|New York Newark
LGA|New York|LaGuardia Airport|New York LaGuardia
LAX|Los Angeles|Los Angeles International Airport
SFO|San Francisco|San Francisco International Airport
ORD|Chicago|O'Hare International Airport
MIA|Miami|Miami International Airport
ATL|Atlanta|Hartsfield-Jackson Atlanta International Airport
DFW|Dallas|Dallas/Fort Worth International Airport
IAH|Houston|George Bush Intercontinental Airport
SEA|Seattle|Seattle-Tacoma International Airport
BOS|Boston|Logan International Airport
IAD|Washington|Washington Dulles International Airport|Washington Dulles
DCA|Washington|Ronald Reagan Washington National Airport|Washington Reagan
LAS|Las Vegas|Harry Reid International Airport
DEN|Denver|Denver International Airport
PHX|Phoenix|Phoenix Sky Harbor International Airport
SAN|San Diego|San Diego International Airport
MCO|Orlando|Orlando International Airport
DTW|Detroit|Detroit Metropolitan Airport
MSP|Minneapolis|Minneapolis-Saint Paul International Airport
PHL|Philadelphia|Philadelphia International Airport
CLT|Charlotte|Charlotte Douglas International Airport
HNL|Honolulu|Daniel K. Inouye International Airport
# Canada
YYZ|Toronto|Toronto Pearson International Airport
YVR|Vancouver|Vancouver International Airport
YUL|Montreal|Montreal-Trudeau International Airport
YYC|Calgary|Calgary International Airport
# Mexico
MEX|Mexico City|Benito Juarez International Airport
CUN|Cancun|Cancun International Airport
# Panama
PTY|Panama City|Tocumen International Airport
# Brazil
GRU|Sao Paulo|Guarulhos International Airport
GIG|Rio de Janeiro|Galeao International Airport
# Argentina
EZE|Buenos Aires|Ministro Pistarini International Airport (Ezeiza)
# Chile
SCL|Santiago|Arturo Merino Benitez International Airport
# Colombia
BOG|Bogota|El Dorado International Airport
# Peru
LIM|Lima|Jorge Chavez International Airport
# South Africa
JNB|Johannesburg|O. R. Tambo International Airport
CPT|Cape Town|Cape Town International Airport
# Egypt
CAI|Cairo|Cairo International Airport
# Ethiopia
ADD|Addis Ababa|Bole International Airport
# Kenya
NBO|Nairobi|Jomo Kenyatta International Airport
# Nigeria
LOS|Lagos|Murtala Muhammed International Airport
# Morocco
CMN|Casablanca|Mohammed V International Airport
RAK|Marrakech|Menara Airport
# Tanzania
DAR|Dar es Salaam|Julius Nyerere International Airport
ZNZ|Zanzibar|Abeid Amani Karume International Airport
# Ghana
ACC|Accra|Kotoka International Airport
# Tunisia
TUN|Tunis|Tunis-Carthage Airport
# Mauritius
MRU|Mauritius|Sir Seewoosagur Ramgoolam International Airport
# Seychelles
SEZ|Seychelles|Seychelles International Airport
# Australia
SYD|Sydney|Kingsford Smith Airport
MEL|Melbourne|Melbourne Airport
BNE|Brisbane|Brisbane Airport
PER|Perth|Perth Airport
ADL|Adelaide|Adelaide Airport
# New Zealand
AKL|Auckland|Auckland Airport
CHC|Christchurch|Christchurch Airport
# Fiji
NAN|Nadi|Nadi International Airport
`;
// Extra search words (old/alternate names) per airport code.
export const ALIASES = {
  DEL: ['new delhi', 'delhi ncr'], BOM: ['bombay'], BLR: ['bangalore', 'bengalooru'], CCU: ['calcutta'], MAA: ['madras'], COK: ['cochin'], TRV: ['trivandrum'],
  GAU: ['gauhati'], BBI: ['bhubaneshwar'], VNS: ['banaras', 'benaras'], IXB: ['siliguri'], PNQ: ['poona'], IXZ: ['andaman'], KUU: ['manali'], IXC: ['mohali'],
  DPS: ['denpasar'], SGN: ['saigon'], JFK: ['nyc', 'new york city'], LHR: ['heathrow'], ICN: ['incheon'], AMS: ['schiphol'], IAD: ['washington dc', 'dc'],
  SFO: ['san fran'], LAX: ['la'], MLE: ['maldives'], PEK: ['peking'], IST: ['constantinople'], HKG: ['hongkong'], KUL: ['kl']
};
// Country names people commonly type.
export const COUNTRY_ALIASES = { uae: 'united arab emirates', usa: 'united states', us: 'united states', america: 'united states', 'united states of america': 'united states', uk: 'united kingdom', england: 'united kingdom', britain: 'united kingdom', korea: 'south korea', holland: 'netherlands' };
