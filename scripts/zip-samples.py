"""
회차별 완성본 웹앱(samples/)을 자료실용 zip으로 묶는 스크립트.

    python3 scripts/zip-samples.py

결과: public/downloads/session3-assessment-board.zip
      public/downloads/session4-assessment-board.zip
      public/downloads/session8-tutor.zip

- 표준 라이브러리만 씁니다(추가 설치 없음).
- node_modules, .next, 실제 키가 든 .env 파일 등은 묶지 않습니다.
- 한국어 Windows 탐색기에서 파일 이름이 깨지지 않게 CP949 이름과 유니코드 이름을 함께 기록합니다
  (scripts/make-sample-data.py 와 같은 방식).
"""
import struct
import sys
import zipfile
import zlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SAMPLES = ROOT / "samples"
OUT = ROOT / "public" / "downloads"

# (samples 아래 폴더, zip 파일 이름, zip 안의 최상위 폴더 이름)
JOBS = [
    ("assessment-board-s3", "session3-assessment-board.zip", "assessment-board"),
    ("assessment-board-s4", "session4-assessment-board.zip", "assessment-board"),
    ("tutor-s8", "session8-tutor.zip", "saebom-tutor"),
]

SKIP_DIRS = {"node_modules", ".next", "out", ".vercel", ".git"}
SKIP_NAMES = {"next-env.d.ts", ".DS_Store"}


class WinZipInfo(zipfile.ZipInfo):
    """한국어 Windows 탐색기의 기본 압축 풀기는 파일명을 CP949로 읽는다.
    그래서 파일명은 CP949로 기록하고(UTF-8 플래그 없음),
    7-Zip·반디집·macOS 등이 읽는 Info-ZIP 유니코드 경로(0x7075)에 UTF-8 이름을 함께 넣는다."""

    def _encodeFilenameFlags(self):
        try:
            return self.filename.encode("cp949"), self.flag_bits & ~0x800
        except UnicodeEncodeError:
            return self.filename.encode("utf-8"), self.flag_bits | 0x800


def add_to_zip(z: zipfile.ZipFile, src: Path, arcname: str):
    arcname = arcname.replace("\\", "/")
    zi = WinZipInfo.from_file(src, arcname)
    zi.__class__ = WinZipInfo
    zi.compress_type = zipfile.ZIP_DEFLATED
    try:
        raw = arcname.encode("cp949")
        if raw != arcname.encode("utf-8"):
            utf8 = arcname.encode("utf-8")
            data = struct.pack("<BI", 1, zlib.crc32(raw)) + utf8
            zi.extra = struct.pack("<HH", 0x7075, len(data)) + data
    except UnicodeEncodeError:
        pass
    with open(src, "rb") as f:
        z.writestr(zi, f.read())


def should_skip(rel: Path) -> bool:
    if any(part in SKIP_DIRS for part in rel.parts):
        return True
    if rel.name in SKIP_NAMES or rel.suffix == ".tsbuildinfo":
        return True
    if rel.name.startswith(".env") and rel.name != ".env.local.example":
        return True  # 실제 키가 든 파일은 절대 묶지 않는다
    return False


def zip_sample(src: Path, dest: Path, root_name: str) -> list[str]:
    """samples/ 아래의 완성본 프로젝트를 node_modules 등을 빼고 묶는다. 묶은 파일 목록을 돌려준다"""
    dest.parent.mkdir(parents=True, exist_ok=True)
    names: list[str] = []
    with zipfile.ZipFile(dest, "w", zipfile.ZIP_DEFLATED) as z:
        for f in sorted(src.rglob("*")):
            rel = f.relative_to(src)
            if not f.is_file() or should_skip(rel):
                continue
            arcname = str(Path(root_name) / rel)
            add_to_zip(z, f, arcname)
            names.append(arcname.replace("\\", "/"))
    return names


def main() -> int:
    missing = [name for name, _, _ in JOBS if not (SAMPLES / name / "package.json").exists()]
    if missing:
        print("샘플 폴더가 없습니다:", ", ".join(missing))
        return 1
    for name, zip_name, root_name in JOBS:
        dest = OUT / zip_name
        names = zip_sample(SAMPLES / name, dest, root_name)
        print(f"\n{dest.relative_to(ROOT)}  ({dest.stat().st_size / 1024:.1f} KB, {len(names)}개 파일)")
        for n in names:
            print("  ", n)
        if not any(n.endswith("/package-lock.json") for n in names):
            print("  ! package-lock.json 이 없습니다. 샘플 폴더에서 npm install 을 먼저 실행하세요.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
