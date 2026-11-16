"""
"교무수첩" 업무 폴더 키트(5–7회차)를 만드는 스크립트.

하는 일
  1. samples/teacher-workspace-start/받은공문/ 에 가상 공문 6건(pdf 4, docx 2)을 만든다.
     (나머지 1건은 txt로 samples 폴더에 들어 있다. 글로 된 파일은 모두 samples 폴더가 원본이다.)
  2. 학사일정 CSV의 날짜·요일이 맞는지 검사하고, Windows에서 한글이 깨지지 않게
     CSV와 .ps1 파일을 "UTF-8 BOM + CRLF"로 맞춘다.
  3. 시작본과 완성본이 함께 쓰는 자료(받은공문·양식·생기부_초안·학사일정·본보기 가정통신문)를
     시작본에서 완성본으로 복사한다. 그래서 이 자료는 시작본만 고치면 된다.
  4. 두 폴더를 zip으로 묶는다. 둘 다 풀면 최상위 폴더 이름이 "새봄고_교무수첩"이다.
       public/downloads/session5-workspace-start.zip
       public/downloads/session7-workspace-done.zip

필요 패키지: reportlab, python-docx
PDF 한글 글꼴: macOS의 AppleGothic(없으면 FONT_PATH를 바꾸세요)

    python3 scripts/make-workspace.py

모든 기관·인물·문서번호·일정은 가상입니다.
"""
import csv
import shutil
import struct
import zipfile
import zlib
from datetime import date
from pathlib import Path

from docx import Document
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parent.parent
SAMPLES = ROOT / "samples"
START = SAMPLES / "teacher-workspace-start"
DONE = SAMPLES / "teacher-workspace-done"
OUT = ROOT / "public" / "downloads"
ZIP_ROOT = "새봄고_교무수첩"
FONT_PATH = "/System/Library/Fonts/Supplemental/AppleGothic.ttf"
NOTICE = "교육용 가상 데이터 — 실제 기관·인물과 관계없음"

# 시작본과 완성본이 똑같이 쓰는 자료. 시작본이 원본이고 완성본 쪽은 매번 새로 복사한다.
SHARED_DIRS = ["받은공문", "양식", "생기부_초안"]
SHARED_FILES = [
    "학사일정_2026-2.csv",
    "보낸문서/2026-09-07_가정통신문_2학기_학부모_상담주간_안내.md",
    "보낸문서/2026-11-11_가정통신문_1학년_진로체험의날_참가_안내.md",
]
SKIP_NAMES = {".DS_Store", "__pycache__", "Thumbs.db"}

pdfmetrics.registerFont(TTFont("KR", FONT_PATH))


# ───────────────────────── 가상 공문 6건 (pdf 4, docx 2) ─────────────────────────
# 날짜 표기를 일부러 문서마다 다르게 썼다(2026. 11. 27.(금) / 2026년 11월 20일(금) / 11월 25일(수) …).
# 공문 요약 스킬이 표기를 하나로 맞추는지 보기 위해서다.

GONGMUN = [
    {
        "file": "가상교육지원청_2학기_학교생활기록부_점검계획_제출.pdf",
        "sender": "가상교육지원청",
        "receiver": "관내 고등학교장 (교무기획부장, 학년 부장)",
        "title": "2026학년도 2학기 학교생활기록부 점검 계획 제출 안내",
        "doc_no": "가상교육지원청 중등교육과-11873",
        "date": "2026. 11. 10.",
        "body": [
            "1. 관련: 「학교생활기록 작성 및 관리지침」",
            "2. 2학기 학교생활기록부 기재 내용의 정확성과 신뢰도를 높이고자 학교별 자체 점검 계획을 아래와 같이 제출하여 주시기 바랍니다.",
            "  가. 제출 내용: 학년별 점검 일정, 점검자 명단(학년 간 교차 점검 포함), 점검 항목",
            "  나. 제출 기한: 2026. 11. 27.(금) 16:00까지",
            "  다. 제출 방법: 붙임 서식을 작성하여 업무포털 공문으로 회신",
            "  라. 작성 단위: 학교당 1부 (학년부별 계획을 교무기획부에서 모아 제출)",
            "3. 점검 결과 보고는 2027년 2월에 따로 안내할 예정이며, 이번에는 계획만 제출합니다.",
            "4. 점검 계획에는 교과 세부능력 및 특기사항의 입력 글자 수 초과 여부와 기재할 수 없는 내용의 포함 여부를 확인하는 절차를 넣어 주시기 바랍니다.",
        ],
        "dept": "가상교육지원청 중등교육과 (학교생활기록부 담당)",
        "attach": "학교생활기록부 자체 점검 계획 서식 1부.  끝.",
        "signer": "가상교육지원청교육장",
    },
    {
        "file": "가상교육지원청_학교폭력_예방교육_실적_제출.pdf",
        "sender": "가상교육지원청",
        "receiver": "관내 초·중·고등학교장 (학생생활안전부장, 학년 부장)",
        "title": "2026학년도 2학기 학교폭력 예방교육 실적 제출 요청",
        "doc_no": "가상교육지원청 학생생활교육과-9921",
        "date": "2026. 11. 9.",
        "body": [
            "1. 귀교의 무궁한 발전을 기원합니다.",
            "2. 2026학년도 2학기 학교폭력 예방교육 운영 현황을 파악하고자 하오니 아래와 같이 실적을 제출하여 주시기 바랍니다.",
            "  가. 제출 내용: 학급별 학교폭력 예방교육 실시 현황(실시 일자, 시수, 참여 학생 수)",
            "  나. 기준일: 2학기 개학일부터 2026년 11월 13일(금)까지 실시한 교육",
            "  다. 제출 기한: 2026년 11월 20일(금) 17:00까지",
            "  라. 제출 방법: 자료집계시스템에 학급 담임이 입력하고 학년 부장이 확인 (공문 회신 불필요)",
            "3. 기준일 이후에 실시하는 교육은 학년 말 실적 조사 때 제출합니다.",
            "4. 학생 이름 등 개인을 알아볼 수 있는 정보는 입력하지 않고 학급별 인원수만 입력합니다.",
        ],
        "dept": "가상교육지원청 학생생활교육과 (학교폭력 예방 담당)",
        "attach": "자료집계시스템 입력 안내 1부.  끝.",
        "signer": "가상교육지원청교육장",
    },
    {
        "file": "새솔교육연수원_겨울방학_교원_직무연수_신청_안내.pdf",
        "sender": "새솔교육연수원(가상)",
        "receiver": "관내 중·고등학교장 (교육연구부장)",
        "title": "2026학년도 겨울방학 교원 직무연수 신청 안내",
        "doc_no": "새솔교육연수원 연수운영부-457",
        "date": "2026. 11. 12.",
        "body": [
            "1. 겨울방학 교원 직무연수를 아래와 같이 운영하오니 희망하는 교원이 신청할 수 있도록 안내하여 주시기 바랍니다.",
            "  가. 연수명: 생성형 AI 활용 수업·평가 설계 직무연수 (15시간, 1학점)",
            "  나. 연수 기간: 2027. 1. 11.(월) – 1. 13.(수), 매일 09:30–15:30",
            "  다. 장소: 새솔교육연수원(가상) 2층 연수실",
            "  라. 대상: 관내 중·고등학교 교원 40명 (선착순, 학교당 2명 이내)",
            "  마. 신청 기한: 2026. 12. 2.(수) 18:00까지",
            "  바. 신청 방법: 연수원 누리집에서 교원이 직접 온라인 신청 (학교 공문 제출 없음)",
            "  사. 연수비: 무료",
            "2. 신청 전에 소속 학교장의 승인을 받아야 하며, 선정 결과는 2026. 12. 9.(수)에 연수원 누리집에 공지합니다.",
        ],
        "dept": "새솔교육연수원(가상) 연수운영부",
        "attach": "연수 운영 계획 1부.  끝.",
        "signer": "새솔교육연수원장",
    },
    {
        "file": "가상시립청소년도서관_겨울_독서_한마당_안내.pdf",
        "sender": "가상시립청소년도서관",
        "receiver": "관내 중·고등학교장 (독서 교육 담당 교사)",
        "title": "2026 겨울 독서 한마당 행사 안내",
        "doc_no": "가상시립청소년도서관 독서문화팀-312",
        "date": "2026. 11. 13.",
        "body": [
            "1. 청소년의 독서 문화를 넓히고자 「2026 겨울 독서 한마당」을 아래와 같이 열고자 하오니 학생들에게 널리 안내하여 주시기 바랍니다.",
            "  가. 일시: 2026. 12. 19.(토) 10:00–16:00",
            "  나. 장소: 가상시립청소년도서관 1층 열린마당",
            "  다. 대상: 중·고등학생 누구나",
            "  라. 내용: 작가와의 만남, 책 교환 장터, 독서 퀴즈",
            "  마. 참가 신청: 학생이 도서관 누리집에서 직접 신청 (2026. 12. 16.(수)까지, 선착순 150명)",
            "2. 이 공문은 행사 안내용이며 학교에서 제출할 서류는 없습니다.",
            "3. 붙임 홍보물을 학급 게시판 등에 붙여 주시면 고맙겠습니다.",
        ],
        "dept": "가상시립청소년도서관 독서문화팀",
        "attach": "행사 홍보물 1부.  끝.",
        "signer": "가상시립청소년도서관장",
    },
    {
        "file": "가상교육지원청_겨울방학_방과후학교_운영계획_제출.docx",
        "sender": "가상교육지원청",
        "receiver": "관내 중·고등학교장 (방과후학교 담당 부장, 학년 부장)",
        "title": "2026학년도 겨울방학 중 방과후학교 운영 계획 제출 안내",
        "doc_no": "가상교육지원청 교육협력과-7785",
        "date": "2026-11-11",
        "body": [
            "1. 겨울방학 중 방과후학교를 안정적으로 운영하고자 학교별 운영 계획을 아래와 같이 제출하여 주시기 바랍니다.",
            "  가. 제출 내용: 겨울방학 방과후학교 운영 계획서 (강좌명, 운영 기간, 강사, 수강 예정 인원, 수익자 부담 경비)",
            "  나. 제출 기한: 2026-12-08(화)",
            "  다. 제출 방법: 붙임 서식을 작성하여 업무포털 공문으로 회신",
            "  라. 작성 단위: 학교당 1부 (학년부별 강좌 수요를 모아 작성)",
            "2. 운영 기간은 학교 사정에 맞게 정하되, 강좌별로 10차시 이상 편성하시기 바랍니다.",
            "3. 수강 신청서와 수익자 부담 경비 안내는 가정통신문으로 미리 알려 주시기 바랍니다.",
        ],
        "table": {
            "caption": "운영 계획서 작성 예시",
            "header": ["강좌명", "운영 기간", "강사", "수강 예정 인원", "수익자 부담 경비"],
            "rows": [
                ["(예) 문학 작품 깊이 읽기", "2027-01-04 – 2027-01-15", "교내 교사", "20명", "교재비 12,000원"],
                ["(예) 수학 개념 다지기", "2027-01-04 – 2027-01-22", "교내 교사", "24명", "없음"],
            ],
        },
        "dept": "가상교육지원청 교육협력과 (방과후학교 담당)",
        "attach": "겨울방학 방과후학교 운영 계획서 서식 1부.  끝.",
        "signer": "가상교육지원청교육장",
    },
    {
        "file": "가상교육청_정보보안_자가점검표_제출.docx",
        "sender": "가상교육청",
        "receiver": "각급 학교장 (정보보안 담당자)",
        "title": "2026년 하반기 교직원 정보보안 자가 점검표 제출 안내",
        "doc_no": "가상교육청 교육정보과-15502",
        "date": "2026-11-06",
        "body": [
            "1. 관련: 가상교육청 정보보안 기본 지침",
            "2. 하반기 정보보안 점검을 아래와 같이 실시하오니 기한 안에 결과를 제출하여 주시기 바랍니다.",
            "  가. 점검 대상: 업무용 컴퓨터를 쓰는 모든 교직원",
            "  나. 점검 방법: 교직원이 붙임의 자가 점검표(10개 항목)를 직접 작성",
            "  다. 제출 기한: 11월 25일(수)까지",
            "  라. 제출 방법: 교직원은 작성한 점검표를 학교 정보보안 담당자에게 내고, 담당자가 취합 결과를 업무포털 공문으로 회신",
            "3. 점검표의 주요 항목은 아래 표와 같습니다.",
        ],
        "table": {
            "caption": "자가 점검표 주요 항목",
            "header": ["번호", "점검 항목"],
            "rows": [
                ["1", "업무용 컴퓨터에 로그인 암호와 화면 보호기 암호를 설정했는가"],
                ["2", "백신 프로그램을 최신 상태로 유지하고 있는가"],
                ["3", "개인정보가 든 파일을 암호화해서 보관하는가"],
                ["4", "휴대용 저장 매체(USB 등)를 등록된 것만 쓰는가"],
                ["5", "생성형 AI 등 외부 서비스에 학생 개인정보나 비공개 자료를 입력하지 않는가"],
            ],
        },
        "dept": "가상교육청 교육정보과 (정보보안 담당)",
        "attach": "교직원 정보보안 자가 점검표 1부.  끝.",
        "signer": "가상교육청교육감",
    },
]


def wrap(text: str, font: str, size: int, width: float) -> list[str]:
    """한 줄이 폭을 넘으면 글자 단위로 줄을 나눈다. 앞쪽 들여쓰기는 이어지는 줄에도 유지한다."""
    indent = text[: len(text) - len(text.lstrip(" "))]
    out, cur = [], ""
    for ch in text:
        if pdfmetrics.stringWidth(cur + ch, font, size) > width:
            out.append(cur)
            cur = indent + "    " + ch
        else:
            cur += ch
    out.append(cur)
    return out


def gongmun_pdf(path: Path, g: dict):
    path.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(path), pagesize=A4, invariant=1)  # invariant: 실행할 때마다 같은 파일이 나오게
    c.setTitle(g["title"])
    w, h = A4
    left, right = 60, w - 60
    c.setFont("KR", 20)
    c.drawCentredString(w / 2, h - 80, g["sender"])
    c.setLineWidth(1.2)
    c.line(left, h - 95, right, h - 95)
    c.setFont("KR", 11)
    y = h - 125
    head = [
        f"수신: {g['receiver']}",
        "(경유)",
        f"제목: {g['title']}",
        "",
        f"문서번호: {g['doc_no']}",
        f"시행일: {g['date']}",
        "",
    ]
    for line in head + g["body"] + ["", f"담당 부서: {g['dept']}", "", f"붙임  {g['attach']}"]:
        for part in wrap(line, "KR", 11, right - left):
            c.drawString(left, y, part)
            y -= 20
    c.setFont("KR", 16)
    c.drawCentredString(w / 2, y - 30, g["signer"])
    c.setFont("KR", 8)
    c.drawString(left, 40, NOTICE)
    c.save()


def gongmun_docx(path: Path, g: dict):
    path.parent.mkdir(parents=True, exist_ok=True)
    doc = Document()
    doc.add_heading(g["sender"], level=1)
    doc.add_paragraph(f"수신: {g['receiver']}")
    doc.add_paragraph("(경유)")
    doc.add_paragraph(f"제목: {g['title']}")
    doc.add_paragraph(f"문서번호: {g['doc_no']}")
    doc.add_paragraph(f"시행일: {g['date']}")
    for line in g["body"]:
        doc.add_paragraph(line)
    if "table" in g:
        t = g["table"]
        doc.add_paragraph(f"〈{t['caption']}〉")
        table = doc.add_table(rows=1, cols=len(t["header"]))
        table.style = "Table Grid"
        for cell, text in zip(table.rows[0].cells, t["header"]):
            cell.text = text
        for row in t["rows"]:
            for cell, text in zip(table.add_row().cells, row):
                cell.text = text
    doc.add_paragraph(f"담당 부서: {g['dept']}")
    doc.add_paragraph(f"붙임  {g['attach']}")
    doc.add_paragraph(g["signer"])
    doc.add_paragraph(NOTICE)
    doc.save(path)


def build_gongmun(dest: Path):
    for g in GONGMUN:
        target = dest / g["file"]
        (gongmun_pdf if target.suffix == ".pdf" else gongmun_docx)(target, g)
    n = sum(1 for f in dest.iterdir() if f.is_file() and f.name not in SKIP_NAMES)
    assert n == 7, f"받은공문에는 7건이 있어야 합니다(지금 {n}건). txt 1건이 samples 폴더에 있는지 확인하세요."


# ───────────────────────── 검사와 Windows 호환 처리 ─────────────────────────

def check_calendar(path: Path):
    """학사일정 CSV의 요일 열이 실제 달력과 맞는지 확인한다. 틀리면 멈춘다."""
    with open(path, encoding="utf-8-sig", newline="") as f:
        rows = list(csv.DictReader(f))
    for r in rows:
        y, m, d = map(int, r["날짜"].split("-"))
        real = "월화수목금토일"[date(y, m, d).weekday()]
        assert r["요일"] == real, f"{path.name}: {r['날짜']}은 {real}요일인데 {r['요일']}요일로 적혀 있습니다."
    dates = [r["날짜"] for r in rows]
    assert dates == sorted(dates), f"{path.name}: 날짜순이 아닙니다."
    return len(rows)


def to_windows_text(path: Path):
    """UTF-8 BOM + CRLF로 맞춘다. 엑셀(CSV)과 Windows PowerShell 5.1(.ps1)이 한글을 바르게 읽게 하기 위해서다."""
    text = path.read_bytes().decode("utf-8-sig").replace("\r\n", "\n")
    path.write_bytes(b"\xef\xbb\xbf" + text.replace("\n", "\r\n").encode("utf-8"))


def sync_shared():
    """시작본의 공용 자료를 완성본으로 복사한다."""
    for name in SHARED_DIRS:
        dst = DONE / name
        if dst.exists():
            shutil.rmtree(dst)
        shutil.copytree(START / name, dst, ignore=shutil.ignore_patterns(*SKIP_NAMES))
    for name in SHARED_FILES:
        (DONE / name).parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(START / name, DONE / name)


# ───────────────────────── zip (BASE scripts/make-sample-data.py 와 같은 방식) ─────────────────────────

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


def zip_dir(src: Path, dest: Path, root_name: str) -> int:
    """폴더를 통째로 묶는다. rglob("*")은 .claude처럼 점으로 시작하는 폴더도 포함한다."""
    dest.parent.mkdir(parents=True, exist_ok=True)
    n = 0
    with zipfile.ZipFile(dest, "w", zipfile.ZIP_DEFLATED) as z:
        for f in sorted(src.rglob("*")):
            rel = f.relative_to(src)
            if any(part in SKIP_NAMES for part in rel.parts) or f.suffix == ".pyc":
                continue
            if f.is_file():
                add_to_zip(z, f, str(Path(root_name) / rel))
                n += 1
    return n


def main():
    build_gongmun(START / "받은공문")
    print("✓ 받은공문 7건 (pdf 4, docx 2 생성 + txt 1)")

    n = check_calendar(START / "학사일정_2026-2.csv")
    to_windows_text(START / "학사일정_2026-2.csv")
    print(f"✓ 학사일정 {n}행, 요일 검사 통과")

    sync_shared()
    for ps1 in DONE.rglob("*.ps1"):
        to_windows_text(ps1)
    for sh in DONE.rglob("*.sh"):
        sh.chmod(0o755)
    assert (DONE / ".claude" / "skills").is_dir(), "완성본에 .claude/skills 폴더가 없습니다."
    assert not (START / ".claude").exists(), "시작본에는 .claude 폴더가 없어야 합니다."
    print("✓ 공용 자료를 완성본으로 복사")

    for src, name in ((START, "session5-workspace-start.zip"), (DONE, "session7-workspace-done.zip")):
        count = zip_dir(src, OUT / name, ZIP_ROOT)
        print(f"✓ {name} ({count} files)")


if __name__ == "__main__":
    main()
