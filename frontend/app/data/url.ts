// frontend/app/data/url.ts
// This file stores product image URLs for reference before adding to database

export const productImageUrls: Record<string, string> = {
  // Format: productId or slug -> external URL
  // Example entries (to be populated by teammate):
  // "macbook-pro-14": "https://example.com/images/macbook-pro-14.jpg",
  // "wireless-mouse": "https://example.com/images/wireless-mouse.jpg",
  "dell-black-silver-asus-laptop":
    "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bGFwdG9wJTIwY29tcHV0ZXJ8ZW58MHx8MHx8fDA%3D",

  "silver-apple-macbook":
    "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGxhcHRvcCUyMGNvbXB1dGVyfGVufDB8fDB8fHww",

  "mackbook-pro":
    "https://images.unsplash.com/photo-1588702548102-e00682affa2a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fGxhcHRvcCUyMGNvbXB1dGVyfGVufDB8fDB8fHww",

  "black-acer-laptop":
    "https://images.unsplash.com/photo-1693206578601-21cdc341d2c8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fGxhcHRvcCUyMGNvbXB1dGVyfGVufDB8fDB8fHww",

  "black-microsoft-laptop":
    "https://images.unsplash.com/photo-1643900074574-8295e3f0af5e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1pY3Jvc29mdCUyMGxhcHRvcHxlbnwwfHwwfHx8MA%3D%3D",

  "gray-microsoft-surface-laptop":
    "https://images.unsplash.com/photo-1724960996795-11a4e709ae84?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fG1pY3Jvc29mdCUyMGxhcHRvcHxlbnwwfHwwfHx8MA%3D%3D",

  "white-macbook-laptop":
    "https://images.unsplash.com/photo-1667940903819-9319fe82949f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fG1hY2Jvb2slMjBsYXB0b3B8ZW58MHx8MHx8fDA%3D",

  "white-hp-laptop":
    "https://images.unsplash.com/photo-1663354027456-ce6a7e07d212?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aHAlMjBsYXB0b3BzfGVufDB8fDB8fHww",

  "gray-cordless-mouse":
    "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW91c2V8ZW58MHx8MHx8fDA%3D",

  "black-cordless-mouse":
    "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bW91c2V8ZW58MHx8MHx8fDA%3D",

  "white-logitech-gseries-cordless-mouse":
    "https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bW91c2V8ZW58MHx8MHx8fDA%3D",

  "black-logitech-cordless-mouse":
    "https://images.unsplash.com/photo-1629121291243-7b5e885cce9b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fG1vdXNlfGVufDB8fDB8fHww",

  "black-computer-mouse":
    "https://images.unsplash.com/photo-1676315487574-0d456abe4e1e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDJ8fG1vdXNlfGVufDB8fDB8fHww",

  "silver-&-black-computer-keyboard":
    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a2V5Ym9hcmR8ZW58MHx8MHx8fDA%3D",

  "black-orange-computer-keyboard":
    "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8a2V5Ym9hcmR8ZW58MHx8MHx8fDA%3D",

  "white-corded-computer-keyboard":
    "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8a2V5Ym9hcmR8ZW58MHx8MHx8fDA%3D",

  "black-&-white-computer-keyboard":
    "https://images.unsplash.com/photo-1625130694338-4110ba634e59?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGtleWJvYXJkfGVufDB8fDB8fHww",

  "black-logitect-keyboard":
    "https://images.unsplash.com/photo-1585314614250-d213876625e1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fGtleWJvYXJkfGVufDB8fDB8fHww",

  "silver-iMac-desktop-computer":
    "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW9uaXRvcnxlbnwwfHwwfHx8MA%3D%3D",

  "gray-computer-desktop-monitor":
    "https://plus.unsplash.com/premium_photo-1680721575441-18d5a0567269?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bW9uaXRvcnxlbnwwfHwwfHx8MA%3D%3D",

  "curved-computer-desktop-monitor":
    "https://images.unsplash.com/photo-1666771410003-8437c4781d49?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzF8fG1vbml0b3J8ZW58MHx8MHx8fDA%3D",

  "light-peach-headpones":
    "https://plus.unsplash.com/premium_photo-1679513691474-73102089c117?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D",

  "black-sony-wireless-headphones":
    "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D",

  "white-sony-corded-headphones":
    "https://images.unsplash.com/photo-1577174881658-0f30ed549adc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZXN8ZW58MHx8MHx8fDA%3D",

  "black-jbl-wireless-headphones":
    "https://images.unsplash.com/photo-1715645970186-7a9d6d816b49?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8amJsJTIwaGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D",

  "jbl-corded-headphones":
    "https://images.unsplash.com/photo-1627926357525-aff29272a5ee?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fGpibCUyMGhlYWRwaG9uZXN8ZW58MHx8MHx8fDA%3D",

  "jbl-minibluetooth-speaker":
    "https://images.unsplash.com/photo-1666460811258-c7ceac639561?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDh8fGpibCUyMGhlYWRwaG9uZXN8ZW58MHx8MHx8fDA%3D",

  "black-&-grey-blender-set":
    "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmxlbmRlcnxlbnwwfHwwfHx8MA%3D%3D",

  "niche-coffe-maker":
    "https://images.unsplash.com/photo-1593421970636-570fcb157915?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YmxlbmRlcnxlbnwwfHwwfHx8MA%3D%3D",

  "multicoloured-stand-mixer":
    "https://images.unsplash.com/photo-1577495917765-9497a0de7caa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YmxlbmRlcnxlbnwwfHwwfHx8MA%3D%3D",

  "black-lg-portable-speaker":
    "https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ymx1ZXRvb3RoJTIwc3BlYWtlcnxlbnwwfHwwfHx8MA%3D%3D",

  "black-jbl-portable-speaker":
    "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Ymx1ZXRvb3RoJTIwc3BlYWtlcnxlbnwwfHwwfHx8MA%3D%3D",

  "silver-mini-bluetooth-speaker":
    "https://images.unsplash.com/photo-1582978571763-2d039e56f0c3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Ymx1ZXRvb3RoJTIwc3BlYWtlcnxlbnwwfHwwfHx8MA%3D%3D",

  "oval-gray-portable-bluetooth-speaker":
    "https://images.unsplash.com/photo-1547052178-7f2c5a20c332?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJsdWV0b290aCUyMHNwZWFrZXJ8ZW58MHx8MHx8fDA%3D",

  "black-jbl-minibluetooth-speaker":
    "https://images.unsplash.com/photo-1588131153911-a4ea5189fe19?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGJsdWV0b290aCUyMHNwZWFrZXJ8ZW58MHx8MHx8fDA%3D",

  "white-electric-radio":
    "https://images.unsplash.com/photo-1565209559029-9e4094301949?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fGJsdWV0b290aCUyMHNwZWFrZXJ8ZW58MHx8MHx8fDA%3D",

  "black-coffee-pot":
    "https://images.unsplash.com/photo-1738520420636-a1591b84723e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZWxlY3RyaWMlMjBrZXR0bGV8ZW58MHx8MHx8fDA%3D",

  "black-electric-kettle":
    "https://images.unsplash.com/photo-1748408082799-94daff13e792?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGVsZWN0cmljJTIwa2V0dGxlfGVufDB8fDB8fHww",

  "electric-hand-fan":
    "https://images.unsplash.com/photo-1665298455913-dd43714f5ad1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZWxlY3RyaWMlMjBmYW58ZW58MHx8MHx8fDA%3D",

  "brown-mini-fan":
    "https://images.unsplash.com/photo-1564510182791-29645da7fac4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZWxlY3RyaWMlMjBmYW58ZW58MHx8MHx8fDA%3D",

  "white-&-black-desk-fan":
    "https://images.unsplash.com/photo-1565151443833-29bf2ba5dd8d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGVsZWN0cmljJTIwZmFufGVufDB8fDB8fHww",

  "gray-refrigerator-with-clipping-path":
    "https://media.istockphoto.com/id/1399160717/photo/refrigerator-standing-in-empty-room-free-copy-space-for-text-or-other-objects-household.jpg?s=612x612&w=0&k=20&c=U9H5GlhjPKbCuNRaOpO1T2H3vbnexjonA2RR-FSf_84=",

  "silver-double-door-refrigerator":
    "https://media.istockphoto.com/id/2230187748/photo/double-door-refrigerator-isolated-on-white-background-side-view-of-stainless-steel-fridge.jpg?s=612x612&w=0&k=20&c=kJ-esZPKw169szV2XinvYnfhn9uz8iqR5_znZYPoWNw=",

  "white-portable-washing-machine":
    "https://media.istockphoto.com/id/2222933728/photo/washer-and-dryer-with-clipping-path.jpg?s=612x612&w=0&k=20&c=txvFhLQK6suhkWKWUKZDhKx_fG3ry1zUyZjisgGTxfY=",

  "gray-front-load-washing-machine":
    "https://media.istockphoto.com/id/1359304117/photo/washing-machine.jpg?s=612x612&w=0&k=20&c=FOJsB9KrzUxZlKpIi2saiSt04gFvUOaVjvI14IjD0iI=",

  "mini-split-air-conditioner-unit":
    "https://media.istockphoto.com/id/2161384121/photo/air-conditioning-equipment-for-home.jpg?s=612x612&w=0&k=20&c=qjaUAUaiMln-eBNjpvxyxg-qxYqbO8b-QkP3d9pg2Zs=",

  "portable-air-conditioner":
    "https://media.istockphoto.com/id/2155212715/photo/close-up-view-of-portable-air-conditioner-with-blurred-living-room-background.jpg?s=612x612&w=0&k=20&c=YtZEXonleY4n7og1xHhhDPw46nVsrVpecTFah8w2xyk=",

  "floor-standing-air-conditioner":
    "https://media.istockphoto.com/id/2236252435/photo/ac-floor-standing.jpg?s=612x612&w=0&k=20&c=9XRmTv8_7fT6OP3TmDKj5jW_ufrGjRXoByGzIAvJy60=",

  "ceiling-air-conditioner":
    "https://media.istockphoto.com/id/1340494255/photo/ceiling-air-conditioner.jpg?s=612x612&w=0&k=20&c=VIffoxEFJXBxcEgo2c263wBzzSCDfLGMjCNopFrlShk=",

  "white-microwave-oven":
    "https://media.istockphoto.com/id/2202464607/photo/side-view-white-microwave-oven-placed-on-an-orange-and-black-refrigerator-white-wall.jpg?s=612x612&w=0&k=20&c=PnUa5wIuJuYlaS0WJ3osXGek60bLBv7C8rd82exqEj0=",

  "black-stainless-steel-microwave":
    "https://media.istockphoto.com/id/174798980/photo/brocolli-being-cooked-in-kitchen-microwave.jpg?s=612x612&w=0&k=20&c=-vORrUtNOY7HGg-IiPB3wTxvJGU3i1dUJUwuiBC9piU=",

  "black-led-television":
    "https://media.istockphoto.com/id/1395191574/photo/black-led-tv-television-screen-blank-isolated.jpg?s=612x612&w=0&k=20&c=ps14JZJh0ebkINcbQyHFsR1J5EC7ozkj_WO7Fh_9IOI=",

  "62-inch-smart-tv":
    "https://media.istockphoto.com/id/2171791025/photo/modern-tv-room-with-pine-wall-paneling-and-wall-mounted-tv-screen.jpg?s=612x612&w=0&k=20&c=r9wy4CzaB37yV4ydpOnKpeeqxwwK6A1KWnxCkwHmsW0=",

  "modern-black-flat-screen-tv":
    "https://media.istockphoto.com/id/2248218037/photo/modern-black-flat-screen-tv-isolated-png-on-transparent-background-television-set-for-home.jpg?s=612x612&w=0&k=20&c=XXylG4zntSuICsip1M_0DV5aqRlu6GsU7M8u79hg8YA=",

  "blak-vacuum-cleaner":
    "https://media.istockphoto.com/id/1395191609/photo/vacuum-cleaner-isolated-on-white.jpg?s=612x612&w=0&k=20&c=BmNjqJS3TxmbQD9MCHRUKVlACXp9gnt9_Epds0wO2DI=",

  "blue-&-black-vacuum-cleaner":
    "https://media.istockphoto.com/id/1395191692/photo/vacuum-cleaner-isolated-on-white.jpg?s=612x612&w=0&k=20&c=1Dst6yz3ehCO3tJjroVHavBj1nFP-v3O2zyCiJb-tF4=",

  "cordless-upright-vacuum-cleaner":
    "https://media.istockphoto.com/id/2206911212/photo/one-cordless-vacuum-cleaner-leaning-on-bed-indoors.jpg?s=612x612&w=0&k=20&c=eQbp5SFDTOgpepkvam9IyN1I4_l03X1a0bN7Jt4vcSo=",

  "robotic-vacuum-cleaner":
    "https://media.istockphoto.com/id/2202141209/photo/robot-vacuum-cleaner-vacuuming-dust-at-room-natural-sunny-lights.jpg?s=612x612&w=0&k=20&c=5AwfCUiHkcQ1IwtSwsnvRBFpKWjb5JOQleLrjf0r73E=",

  "transparent-electric-kettle":
    "https://media.istockphoto.com/id/1710509413/photo/transparent-electric-kettle-with-boiling-water-in-the-kitchen.jpg?s=612x612&w=0&k=20&c=1nC3XJLqG1Uo8qf4EQ7LMfQ8L_fMY_Ioz1gZfwKRn20=",

  "white-electric-kettle":
    "https://media.istockphoto.com/id/1449302707/photo/caucasian-female-office-employee-using-an-electric-kettle-at-work.jpg?s=612x612&w=0&k=20&c=xU3EFVmdYOPFbkYOVup-44XpHBynYrV_EgutVgm7elw=",

  "coffe-maker-electric-kettle-toaster-set":
    "https://media.istockphoto.com/id/1454765676/photo/coffee-maker-electric-kettle-and-toaster-on-the-kitchen-counter.jpg?s=612x612&w=0&k=20&c=op64ooss5h4M_hvX5nHSwYO3lqpDimZq-n1uKbnrDjc=",

  "biege-gold-vintage-toaster":
    "https://media.istockphoto.com/id/2192118589/photo/vintage-toaster-beige-and-gold-color-isolated-on-white-background-with-clipping-path-retro.jpg?s=612x612&w=0&k=20&c=axRRUXBuhQ6-ixfvmQchm-AJ4K0zwAerYeJ8m2E6Nwc=",

  "modern-grill-toaster":
    "https://media.istockphoto.com/id/1434131748/photo/modern-grill-maker-with-sandwiches-on-white-background.jpg?s=612x612&w=0&k=20&c=WXCLmioH_yXFgNAj3B3Xe9FNI_ukyOW60o-WdleCAiY=",

  "white-modern-electric-grill":
    "https://media.istockphoto.com/id/2232494185/photo/modern-electric-grill-perfectly-designed-for-use-on-a-kitchen-countertop-surface.jpg?s=612x612&w=0&k=20&c=iUGbCEdjxmQf3qvJPILMsyUERayCa1McW87hVplVcJ0=",

  "plastic-sandwich-toaster":
    "https://media.istockphoto.com/id/2005244671/photo/new-white-opened-plastic-sandwich-maker-with-dark-black-nonstick-surface-inside-on-light-blue.jpg?s=612x612&w=0&k=20&c=cn5bvlfaJA-a_6Gcattnz0rVlCH2Gr2IPq5ZUpEG7A0=",

  "white-&-green-electric-iron":
    "https://media.istockphoto.com/id/534322466/photo/ironing-tool.jpg?s=612x612&w=0&k=20&c=jyUdOygnTW34uxEkoBAcSftmSWscqunLMmxJRGekcEM=",

  "white-&-blue-cloth-iron":
    "https://media.istockphoto.com/id/1212499394/photo/clothes-iron-isolated-on-white-household-small-appliance-modern-flatiron-or-flat-iron-with.jpg?s=612x612&w=0&k=20&c=HBSPhgAMRweXQ9Ls8zEb_RoEhysTcDn5X5341NRn3Ak=",

  "gray-dishwasher-machine":
    "https://media.istockphoto.com/id/155351503/photo/dishwasher.jpg?s=612x612&w=0&k=20&c=ed3lbd6pYCct0IGXGKj_RRulegRIcGdT_-FdgC2EuBw=",

  "white-dishwasher-machine":
    "https://media.istockphoto.com/id/181865408/photo/dishwasher.jpg?s=612x612&w=0&k=20&c=KPMPYPxdex-PySJlBILRJEQ2CjNMOWhPhTrUgpcj__s=",

  "electric-fan-heater":
    "https://media.istockphoto.com/id/1454589703/photo/electric-fan-heater-in-the-cozy-home-interior.jpg?s=612x612&w=0&k=20&c=fPPzpcM0_Iqy9ykWGLJ9NINtKayaPxK654iEufe6Cz8=",

  "white-electric-home-heater":
    "https://media.istockphoto.com/id/1291048000/photo/a-young-family-wearing-bright-polka-dot-socks-warms-their-cold-feet-near-an-electric-heater.jpg?s=612x612&w=0&k=20&c=qEbX3GNgFSCcW3hvcqLNknvtYlrfiSSMM0EVL0yYWYw=",

  "electric-home-heater":
    "https://media.istockphoto.com/id/2177128088/photo/oil-heater-stands-on-the-floor-near-the-sofa-no-people-empty-room-copy-space-heat-saving.jpg?s=612x612&w=0&k=20&c=3qJbrDtyFZdlHXu5ARCKDicSNR-IkGjn5yppGlvBqlY=",

  "dehumudifier-machine":
    "https://media.istockphoto.com/id/2023034504/photo/dehumidifier-inside-a-house.jpg?s=612x612&w=0&k=20&c=C7YFEDSk_F_eDFZq0-QNZCY1TC3l95DfJy4T0jDGa7Q=",

  "air-purifier-machine":
    "https://media.istockphoto.com/id/2156089660/photo/close-up-of-an-air-purifier-in-modern-living-room.jpg?s=612x612&w=0&k=20&c=EJwG0vExo8Zn6IMsx2qgW1FIZuHgvx2h3bGdXsfo2Fc=",

  "home-dehumudifier":
    "https://media.istockphoto.com/id/474183224/photo/dehumidifier.jpg?s=612x612&w=0&k=20&c=9RSGcrF6yfoUSCm-nwnEE8Y7Px00Va5K_5yU0Bdukj4=",

  "portable-air-humidifier":
    "https://media.istockphoto.com/id/2249187294/photo/portable-air-humidifier.jpg?s=612x612&w=0&k=20&c=b49jkrLK3BPWMf-iLOzLV8rkk68Rh1hGUhcxJ39-Ucc=",

  "internet-router-device":
    "https://media.istockphoto.com/id/2161973192/photo/internet-router-with-wifi-sign-and-smart-phone-in-a-modern-living-room.jpg?s=612x612&w=0&k=20&c=Cd-dWDUFW3qwaTozhzsxHXSJvafmzPOgaNqE1ZJZSmw=",

  "wifi-router":
    "https://media.istockphoto.com/id/2226904469/photo/new-white-wi-fi-router-near-potted-plant-on-black-shelf.jpg?s=612x612&w=0&k=20&c=rYmWDMGCaPpcL0G7Xwi71hkWjhuZ_HlCjZyhRJeXUFo=",

  "black-coloured-internet-router":
    "https://media.istockphoto.com/id/1494879049/photo/home-internet-router-on-desk-from-home-office.jpg?s=612x612&w=0&k=20&c=9CXIt9l6gGhWfLEHc0Oz5QAgGHaEMG0vDvCQp_2sf9Q=",

  "modern-wifi-router-device":
    "https://media.istockphoto.com/id/2252479687/photo/modern-wifi-router-with-antennas-next-to-cactus-on-bright-white-desk-symbol-of-home-comfort.jpg?s=612x612&w=0&k=20&c=wWQm7slexsU2PLSH6mFFF4xGnveCAR1XU5lE1D0WtVg=",

  "tungsen-flourescent-led-bulb":
    "https://media.istockphoto.com/id/1566472661/photo/tungsten-bulb-fluorescent-bulb-and-led-bulb.jpg?s=612x612&w=0&k=20&c=TvWVw2X6hMku9HmmgsC0JyTDx9MZS5Dr_AajSXkEGlE=",

  "led-light":
    "https://media.istockphoto.com/id/104462144/photo/an-up-close-picture-of-led-lights.jpg?s=612x612&w=0&k=20&c=GSuwkn0_wVziFP0S8DBQO0a6NK9CYKIybRTTBy3g3fA=",

  "gold-brass-multi-pendant-lamp":
    "https://media.istockphoto.com/id/2235943254/photo/golden-brass-multi-pendant-lamp-hanging-in-a-modern-interior-design.jpg?s=612x612&w=0&k=20&c=Gy8Gg16QJUJq9yce0-l081SzqrfvnqkJK5Rw6fPqNd0=",

  "gold-white-chandelier-lamp":
    "https://media.istockphoto.com/id/1360388097/photo/beautiful-chandelier-hanging-from-ceiling-with-classic-gold-plated-fixtures.jpg?s=612x612&w=0&k=20&c=oC0cNob4A63akxbdPt8uAFoflUImfvtFJuWOug1KRAo=",

  "crystal-brass-chandelier-lamp":
    "https://media.istockphoto.com/id/663267894/photo/crystal-glass-chandelier-isolated.jpg?s=612x612&w=0&k=20&c=AykdxcW1s-IFqKC_jy1G3rsDoBYHVm7rAyFepUJMyek=",

  "unique-modern-chandelier-lamp":
    "https://media.istockphoto.com/id/2178403201/photo/unique-modern-chandelier-with-multiple-light-bulbs.jpg?s=612x612&w=0&k=20&c=DgAqwOoivV8y9h5SkTy96osomLz6g6voYt3SeS8ziIc=",

  "luxury-led-chandelier-lamp":
    "https://media.istockphoto.com/id/1291735152/photo/luxury-led-chandelier-wall-hanging.jpg?s=612x612&w=0&k=20&c=KsXln-78cf6QnYR9NrmdWIRAqr-lgeuOi78bt3-rOjI=",

  "circular-chandelier-lamp":
    "https://media.istockphoto.com/id/2240898789/photo/circular-chandelier.jpg?s=612x612&w=0&k=20&c=VuvLCqEQhXe6JECR8BvZDVWOa8b0MtDjJAfjDX8UG5g=",

  "square-rounded-chandelier-lamp":
    "https://media.istockphoto.com/id/1320266900/photo/a-round-lamp-with-a-rectangular-iron-frame-suspended-from-the-ceiling-illuminating-in-gold.jpg?s=612x612&w=0&k=20&c=TlXab8hW2AsgvZJcJv67Gj8lnH2bU8JJhZJXysln4TU=",

  "white-20,000mAh-power-bank":
    "https://media.istockphoto.com/id/2167358400/photo/white-power-bank-for-charging-smartphones-and-various-digital-devices-on-a-white-wooden.jpg?s=612x612&w=0&k=20&c=vK6TWuMvC-aT3nj1z3JSilUdzdM562K99pm_BAYgHaQ=",

  "flat-hair-straightener":
    "https://media.istockphoto.com/id/899740104/photo/ceramic-flat-iron-hair-straightener.jpg?s=612x612&w=0&k=20&c=3-kMC8EcULmDCYQql9hyrXxJq_A8qkpMtDfUOJ85jFY=",

  "thermal-hair-protector-set":
    "https://media.istockphoto.com/id/2064295597/photo/hair-tools-with-thermo-protection-on-color-background-top-view.jpg?s=612x612&w=0&k=20&c=fVzElGg2DES4mQCyhnMxDawhuhX-tYNzTLzwGDxcZv0=",

  "white-hair-straightener":
    "https://media.istockphoto.com/id/2194976414/photo/hair-straightener-with-thermo-protection-on-concrete-background-top-view.jpg?s=612x612&w=0&k=20&c=rvKYEzr2_s1XjiUX1JSBAOYCfoX5RXhrXjaZl3hTBZ8=",

  "white-thermal-hair-dryer":
    "https://media.istockphoto.com/id/1189932297/photo/hair-dryer.jpg?s=612x612&w=0&k=20&c=nI4xMJyBscYo-b7u8OPFqlcneuTrpVc-DeO0ntziN60=",

  "black-hair-dryer":
    "https://media.istockphoto.com/id/2178245760/photo/black-hair-dryer.jpg?s=612x612&w=0&k=20&c=aBcBMme8a4Qc9-14NcKY8UjQinmp3eD2j1IWi9kLRBs=",

  "hair-clipper":
    "https://media.istockphoto.com/id/1265126713/photo/hair-clipper.jpg?s=612x612&w=0&k=20&c=u7X61GpzdZbctz8SicWJCIGvTGpLMPBTCTHTO34y3uQ=",

  "hair-clipper-set":
    "https://media.istockphoto.com/id/1011367220/photo/barber-clipper-on-a-table-with-attachments.jpg?s=612x612&w=0&k=20&c=sIOaXMlxzfmNl1mNGbS1pQB7zdAoBWAURzazc9Qyyn0=",

  "white-wall-cctv-camera":
    "https://media.istockphoto.com/id/1977230951/photo/cctv-camera-installed-on-wall-of-the-building-scan-the-area-for-surveillance-purposes-can-be.jpg?s=612x612&w=0&k=20&c=f-Nw4cMVtYRU5Wo5D_625XfSU694lt-pSMx35RtyeiI=",

  "rounded-cctv-security-camera":
    "https://media.istockphoto.com/id/1438133300/photo/cctv-camera-installed-on-wall-of-the-building-or-office.jpg?s=612x612&w=0&k=20&c=y_M6m5RKrTuLAriKB8cF6qyEpI1ZUg1P4uzHZHPbntw=",

  "black-cctv-surveillance-camera":
    "https://media.istockphoto.com/id/669688216/photo/security-camera-in-the-shopping-mall.jpg?s=612x612&w=0&k=20&c=GEbT21bkPjZ0tn5sPDXi3DmZvUgI2R6cn8cOIe-xTs0=",
};

// Usage: Reference these URLs when manually adding products to the database
