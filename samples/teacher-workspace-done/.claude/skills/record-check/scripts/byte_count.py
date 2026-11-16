#!/usr/bin/env python3
"""학교생활기록부 글의 글자 수와 바이트 수를 세는 스크립트.

표준 라이브러리만 씁니다. 파일이나 폴더를 받아 파일마다 한 줄씩 출력합니다.

    python3 byte_count.py 생기부_초안
    python3 byte_count.py 생기부_초안/10301.txt --limit 1500
    python3 byte_count.py 생기부_초안 --limit 900 --newline-bytes 2

세는 규칙
  - 한글 1자 = 3바이트, 영문·숫자·공백·문장부호(ASCII) 1자 = 1바이트
  - 줄바꿈(엔터) 1번 = --newline-bytes 값 (기본 1)
  - 그 밖의 문자(가운뎃점 ·, 둥근 따옴표, 한자 등)는 UTF-8 바이트 수
  - 파일 맨 끝의 줄바꿈과 파일 머리의 BOM은 세지 않음

기본 한도 1500바이트와 줄바꿈 1바이트는 교육부 「2026학년도 학교생활기록부
기재요령(고등학교)」 208쪽 표의 안내(과목별 세부능력 및 특기사항 500자,
한글 1자 3Byte, 영문·숫자 1자 1Byte, 엔터 1Byte)를 따른 값입니다.
한도는 영역과 학년도에 따라 다르므로 --limit로 바꿔 쓰고, 최종 확인은
나이스(NEIS) 화면에서 하세요.
"""
import argparse
import sys
from pathlib import Path


def read_text(path: Path) -> tuple[str, str]:
    """파일을 읽어 (본문, 인코딩 이름)을 돌려준다. UTF-8이 아니면 CP949(메모장 ANSI)로 다시 읽는다."""
    raw = path.read_bytes()
    try:
        return raw.decode("utf-8-sig"), "UTF-8"
    except UnicodeDecodeError:
        return raw.decode("cp949"), "CP949"


def count(text: str, newline_bytes: int) -> dict:
    """글자 수와 바이트 수를 센다."""
    body = text.replace("\r\n", "\n").replace("\r", "\n").rstrip("\n")
    chars = hangul = ascii_ = other = newlines = total = 0
    for ch in body:
        if ch == "\n":
            newlines += 1
            total += newline_bytes
            continue
        chars += 1
        size = len(ch.encode("utf-8"))
        total += size
        if "가" <= ch <= "힣":
            hangul += 1
        elif size == 1:
            ascii_ += 1
        else:
            other += 1
    return {
        "chars": chars,       # 줄바꿈을 뺀 글자 수(공백 포함)
        "hangul": hangul,     # 한글 음절 수
        "ascii": ascii_,      # 영문·숫자·공백·문장부호 수
        "other": other,       # 그 밖의 문자 수
        "newlines": newlines,
        "bytes": total,
    }


def collect(targets: list[str], ext: str) -> list[Path]:
    """인자로 받은 파일과 폴더에서 셀 파일 목록을 만든다. 폴더는 바로 아래의 해당 확장자 파일만."""
    files: list[Path] = []
    for t in targets:
        p = Path(t)
        if p.is_dir():
            files += sorted(f for f in p.iterdir() if f.is_file() and f.suffix.lower() == ext)
        elif p.is_file():
            files.append(p)
        else:
            print(f"[건너뜀] 찾을 수 없음: {t}", file=sys.stderr)
    return files


def main() -> int:
    ap = argparse.ArgumentParser(description="학교생활기록부 글의 글자 수·바이트 수를 셉니다.")
    ap.add_argument("targets", nargs="+", help="파일 또는 폴더 (여러 개 가능)")
    ap.add_argument("--limit", type=int, default=1500, help="한도 바이트 (기본 1500 = 한글 500자)")
    ap.add_argument("--newline-bytes", type=int, default=1, help="줄바꿈 1번의 바이트 수 (기본 1)")
    ap.add_argument("--ext", default=".txt", help="폴더를 받았을 때 셀 파일 확장자 (기본 .txt)")
    args = ap.parse_args()

    # 화면이 아니라 다른 프로그램(에이전트)이 출력을 받아 갈 때는 UTF-8로 내보낸다.
    # 한글 Windows에서 출력이 CP949로 나가 글자가 깨지는 일을 막기 위해서다.
    if not sys.stdout.isatty():
        sys.stdout.reconfigure(encoding="utf-8")
    else:
        sys.stdout.reconfigure(errors="replace")

    files = collect(args.targets, args.ext if args.ext.startswith(".") else "." + args.ext)
    if not files:
        print("셀 파일이 없습니다.", file=sys.stderr)
        return 1

    print(f"한도 {args.limit:,}바이트 · 줄바꿈 1번 = {args.newline_bytes}바이트")
    print("| 파일 | 글자 수 | 바이트 | 한도 대비 | 판정 | 한글 | 영문·숫자·공백·부호 | 기타 문자 | 줄바꿈 |")
    print("| - | -: | -: | -: | - | -: | -: | -: | -: |")
    over = 0
    for f in files:
        try:
            text, enc = read_text(f)
        except (OSError, UnicodeDecodeError) as e:
            print(f"| {f.name} | 읽지 못함({type(e).__name__}) | | | | | | | |")
            continue
        c = count(text, args.newline_bytes)
        diff = c["bytes"] - args.limit
        if diff > 0:
            verdict, over = "초과", over + 1
        else:
            verdict = "이내"
        note = "" if enc == "UTF-8" else f" ({enc})"
        print(
            f"| {f.name}{note} | {c['chars']:,} | {c['bytes']:,} | {diff:+,} | {verdict} "
            f"| {c['hangul']:,} | {c['ascii']:,} | {c['other']:,} | {c['newlines']:,} |"
        )
    print(f"파일 {len(files)}개 중 한도 초과 {over}개")
    return 0


if __name__ == "__main__":
    sys.exit(main())
