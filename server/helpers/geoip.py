import re
from bisect import bisect
from pathlib import Path
import os

MAX_IPV4 = 2**32-1
MAX_IPV6 = 2**128-1
DIGITS = set('0123456789abcdef')
le255 = '(25[0-5]|2[0-4]\d|[01]?\d\d?)'
IPV4_PATTERN = re.compile(f'^({le255}\.){{3}}{le255}$')
EMPTY = re.compile(r':?\b(?:0\b:?)+')

BASE_DIR = Path(__file__).resolve().parent 

def parse_ipv4(ip: str) -> int:
    assert isinstance(ip, str) and IPV4_PATTERN.match(ip)
    a, b, c, d = ip.split('.')
    return (int(a) << 24) + (int(b) << 16) + (int(c) << 8) + int(d)


def to_ipv4(n: int) -> str:
    assert isinstance(n, int) and 0 <= n <= MAX_IPV4
    return ".".join(str(n >> i & 255) for i in range(24, -1, -8))


def parse_ipv6(ip: str) -> int:
    assert isinstance(ip, str) and len(ip) <= 39
    segments = ip.lower().split(":")
    l, n, p, fields, compressed = len(segments), 0, 7, 0, False
    last = l - 1
    for i, s in enumerate(segments):
        assert fields <= 8 and len(s) <= 4 and not set(s) - DIGITS
        if not s:
            if i in (0, last):
                continue
            assert not compressed
            p = l - i - 2
            compressed = True
        else:
            n += int(s, 16) << p*16
            p -= 1
        fields += 1
    return n


def to_ipv6(n: int, compress: bool = False) -> str:
    assert isinstance(n, int) and 0 <= n <= MAX_IPV6
    ip = '{:032_x}'.format(n).replace('_', ':')
    if compress:
        ip = ':'.join(s.lstrip('0')
            if s != '0000' else '0' for s in ip.split(':'))
        longest = max(EMPTY.findall(ip))
        if len(longest) > 2:
            ip = ip.replace(longest, '::', 1)
    return ip


def parse_entry4(e: str) -> tuple:
    a, b, c = e.split(",")
    return (int(a), int(b), c)


def parse_entry6(e: str) -> tuple:
    a, b, c = e.split(",")
    return (parse_ipv6(a), parse_ipv6(b), c)

geoip_file = BASE_DIR / "geoip.txt"  # Construct the path to geoip.txt
with open(geoip_file, "r") as file:
    data4 = list(map(parse_entry4, file.read().splitlines()))
starts4, ends4, countries4 = zip(*data4)

geoip6_file = BASE_DIR / "geoip6.txt"  # Construct the path to geoip6.txt
with open(geoip6_file, "r") as file:
    data6 = list(map(parse_entry6, file.read().splitlines()))
starts6, ends6, countries6 = zip(*data6)


class IP:
    parse = [parse_ipv4, parse_ipv6]
    starts = [starts4, starts6]
    ends = [ends4, ends6]
    countries = [countries4, countries6]


def geoip_country(ip: str, mode: int=0) -> str:
    assert mode in {0, 1}
    n = IP.parse[mode](ip)
    if not (i := bisect(IP.starts[mode], n)):
        return False
    i -= 1
    return False if n > IP.ends[mode][i] else IP.countries[mode][i]

# function to get country from an IP address
def get_country_from_ip(ip: str) -> str:
    return geoip_country(ip, mode=0)