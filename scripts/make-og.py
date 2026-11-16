"""공유 미리보기 이미지(public/og.png, 1200x630)를 만든다.  python3 scripts/make-og.py  (pillow 필요, macOS 글꼴 사용)"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
FONT = "/System/Library/Fonts/AppleSDGothicNeo.ttc"
W, H = 1200, 630


def font(size, index=6):  # 6 = Bold, 2 = Medium
    return ImageFont.truetype(FONT, size, index=index)


img = Image.new("RGB", (W, H), "#002855")
glow = Image.new("RGB", (W, H), "#002855")
g = ImageDraw.Draw(glow)
g.ellipse((760, -260, 1420, 400), fill="#0b6fb8")
g.ellipse((-260, 380, 320, 960), fill="#123f86")
img = Image.blend(img, glow.filter(ImageFilter.GaussianBlur(120)), 0.9)
d = ImageDraw.Draw(img)

# 배지
badge = "서울삼육고등학교 교사 연수 · 8회차"
bw = d.textlength(badge, font=font(26, 2))
d.rounded_rectangle((80, 84, 80 + bw + 44, 84 + 52), radius=26, outline="#7fa6d6", width=2)
d.text((102, 95), badge, font=font(26, 2), fill="#e6f0fb")

# 제목
d.text((80, 190), "수업을 설계하는 사람이", font=font(76), fill="#ffffff")
d.text((80, 290), "도구도 직접 만듭니다", font=font(76), fill="#7fd3ff")

# 설명
d.text((80, 420), "Claude Code 바이브 코딩에서 업무용·교육용 AI 에이전트까지", font=font(32, 2), fill="#cfe0f5")

# 하단
d.line((80, 520, 1120, 520), fill="#3b5f93", width=2)
d.text((80, 544), "교실과 교무실을 바꾸는 바이브 코딩", font=font(28), fill="#ffffff")
right = "1부 바이브 코딩 기초 · 2부 에이전트 개발"
d.text((1120 - d.textlength(right, font=font(24, 2)), 548), right, font=font(24, 2), fill="#a9c3e6")

img.save(ROOT / "public" / "og.png", optimize=True)
print("public/og.png", img.size)
