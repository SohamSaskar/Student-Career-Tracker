package com.devtrack.util;

import java.security.SecureRandom;

/**
 * BCrypt password hashing implementation (MindRot Java BCrypt).
 * BSD licensed pure Java implementation.
 */
public class BCrypt {
    private static final int BCRYPT_COST_TIME = 10;
    private static final int BLOWFISH_NUM_ROUNDS = 16;

    private static final int P_array[] = {
        0x243f6a88, 0x85a308d3, 0x13198a2e, 0x03707344, 0xa4093822, 0x299f31d0,
        0x082efa98, 0xec4e6c89, 0x452821e6, 0x38d01377, 0xbe5466cf, 0x34e90c6c,
        0xc0ac29b7, 0xc97c50dd, 0x3f84d5b5, 0xb5470917, 0x9216d5d9, 0x8979fb1b
    };

    private static final int S_box[] = {
        0xd1310ba6, 0x98dfb5ac, 0x2ffd72db, 0xd01adfb7, 0xb8e1afed, 0x6a267e96,
        0xba7c9045, 0xf12c7f99, 0x24a19947, 0xb3916cf7, 0x0801f2e2, 0x858efc16,
        0x636920d8, 0x71574e69, 0xa458fea3, 0xf4933d7e, 0x0d95748f, 0x728eb658,
        0x718bcd58, 0x82154aee, 0x7b54a41d, 0xc25a59b5, 0x9c30d539, 0x2af26013,
        0xc5d1b023, 0x286085f0, 0xca417918, 0xb8db3f58, 0x93c2239e, 0x08f7c9ed,
        0x5771202a, 0x9d34384a, 0x47c19458, 0xac007554, 0x3300c868, 0x65934f0c,
        0x7e878393, 0x24379025, 0x4a7484aa, 0x6ea9e000, 0x556886b1, 0x00e125b2,
        0x1c59d871, 0x5b2f3479, 0x661a249b, 0x5076479b, 0x7ae37d6d, 0x52c2c923,
        0xf397753a, 0x4425a895, 0x5f992d99, 0xf023eca7, 0x0d99fd7b, 0x03730590,
        0x83e2003c, 0x85175005, 0x32236a24, 0x140c117b, 0x2ef88062, 0x53b3f2c5,
        0x7599105c, 0x25430a99, 0x75209242, 0x3a925439, 0x74229ee0, 0x717997aa,
        0x1dc6806e, 0x011e74f1, 0x501a3512, 0x4036f01c, 0x9f5a05b3, 0x98f62f3b,
        0x789b7d85, 0x5a18a5be, 0xaa2d6597, 0x41f3e7b4, 0x70529d20, 0x6a0c598c,
        0xbc1ecbc0, 0xd6c66606, 0x205562d6, 0x31567d13, 0x5a639d67, 0x59902644,
        0x9f8c68aa, 0x6d9f82d2, 0x77c77c6e, 0xec44eb88, 0xace58097, 0x855845cb,
        0x145a30ed, 0x8e820ef0, 0x2724fa76, 0x9c3132cf, 0xaa27fa6d, 0x272719d3,
        0x5ba82643, 0x77ae7478, 0x52f6f710, 0x6e2df401, 0x16a4f785, 0x7c73a871,
        0x011b9815, 0x3036577d, 0xae7936a2, 0x4114258b, 0x3b890885, 0xa9b12275,
        0xb7548231, 0x04470659, 0x08b292e2, 0x8a923594, 0x8848d56b, 0x8e09e13a,
        0x45258e77, 0x1c8b3ed6, 0x217d8487, 0x05f8aa99, 0x39a04f21, 0xaa81ef23,
        0x6a129671, 0x2e06180a, 0x7292afc8, 0xdd62e843, 0xec345579, 0x7fae3720,
        0x16027a4d, 0x0f2a70cb, 0xbf0571f0, 0xd03e05a3, 0x26be3f07, 0x5395a121,
        0xec6f8f53, 0x8e4209ac, 0x1410d481, 0x708084a4, 0x7593c66d, 0x6c62c2f1,
        0x8a02bc92, 0x70d8a599, 0x33ceca3b, 0x4e6500a0, 0x6854b423, 0x69687e1a,
        0x44fa7580, 0x153f3e1b, 0x0374e2d3, 0x01235122, 0x6002f232, 0x96f42c2f,
        0x05573428, 0x2e4a838b, 0x56a63aa3, 0x2e6f4370, 0x07508499, 0x03a7dce4,
        0xcd167b25, 0x85368a5c, 0x66c88616, 0xe11f32a7, 0xe9d06b46, 0x367f08c3,
        0xd1d428bf, 0x7a835fd4, 0x4c207b7b, 0x8e305260, 0x5608ed17, 0x274d8ca1,
        0x09268f76, 0x93309a63, 0x86ac24a9, 0xce2d2426, 0x48e11c62, 0x718a22ca,
        0x48325a74, 0xd47a7b8e, 0x7ad08a10, 0x26a2d989, 0xa0b10bc2, 0x603f90fd,
        0xdc28723c, 0x20556272, 0x2e753909, 0x62957b98, 0x256e2677, 0x21c8b321,
        0xd6d31c46, 0x07d0840b, 0xd450d03b, 0x63352763, 0x0e5d4cb0, 0x69260d70,
        0x0c99a80e, 0x12b50937, 0x02830f30, 0x4316d289, 0x6b772c65, 0xe2cc0949,
        0x0874e0d9, 0x8fb97bc7, 0x05b2a0c3, 0x673eb64f, 0x0a1a9aae, 0x4c330f81,
        0x9f55a4f5, 0x0b89b418, 0x47e1d530, 0x09bc3a00, 0x2194fe9b, 0x16b04e6b,
        0x19941a31, 0x3c246f49, 0x68bc5b44, 0x2a106821, 0x46429f95, 0x7387edb8,
        0xc48c90b6, 0xd00a0b2d, 0x5a18a99a, 0x15f7b8e8, 0x478ef8d9, 0xb689bcbf,
        0xdaab28b5, 0x56a644e5, 0xdc0ab1b6, 0xa51b8c00, 0x43eb492f, 0x9a3699cb,
        0x45a6c117, 0x787a718c, 0x71790b4e, 0x05e19a6d, 0xa1d5bfa4, 0x8681c62f,
        0x3e18a0eb, 0x6a21390d, 0x00d41e77, 0x769b561c, 0x42967664, 0x7a27a810,
        0x56bf8f47, 0xf6930d63, 0x15c5e8fa, 0x889813b2, 0x060cd384, 0x403c9d64,
        0x03810237, 0x48967fbc, 0x32130e9d, 0x93309a47, 0x91d90470, 0xa4365319,
        0xd1d2e1b1, 0x53580a13, 0x7a9ec49b, 0x20ed57a7, 0x133ec678, 0x2f60a69a,
        0xefb05786, 0x8d5c414c, 0x23a1a9a8, 0x127b876a, 0x0853755b, 0x028d7524,
        0x59902641, 0x2c640263, 0x75990089, 0x13a2958d, 0x7460c384, 0x9484b3d7,
        0x80352ef2, 0xb8005b8a, 0x7e889b7c, 0x4bf2e533, 0xa8715ab8, 0x8f7d9834,
        0x19a00ed4, 0xa8092285, 0x59046f04, 0x8264e164, 0xa8f6356c, 0x7f48a183,
        0x20521e49, 0xd0355416, 0x47631ed9, 0x28639fa9, 0x3a56aa13, 0x0952be7b,
        0x78ab1220, 0x868b1399, 0x367f08d0, 0x6e9f29d2, 0xdc0aa520, 0x59aac0d2,
        0x181e1e9d, 0x6c6e73e9, 0x19485e92, 0xa2c39546, 0x5593883a, 0xa8992015,
        0xc469d41d, 0xc1d54988, 0x37ed2c62, 0x6ee48b0c, 0x206cb323, 0xe11e9f1d,
        0x61665a31, 0x5248cd90, 0x6f9175d7, 0x7623910c, 0x7ec6d460, 0xc42e051d,
        0x62953255, 0x66c8d76e, 0x794f5700, 0x8a9235e1, 0x4e6500a8, 0xb842a8b9,
        0xc4e5904d, 0x29432d4b, 0x07f4d0e6, 0xa51b439c, 0x2c0d8329, 0x595d7591,
        0x45239a51, 0x33b82145, 0x93c223b2, 0x71790a36, 0x418a08d2, 0x5f24f762,
        0x66299f24, 0x7d6a5043, 0x2633ca5e, 0x8d5c9043, 0x696894b4, 0x09a32c25,
        0x201c1071, 0x931160b9, 0x3d7023cc, 0x2a9d8212, 0x3e1858b7, 0xfa394a8c,
        0xc7719602, 0xe8449c25, 0xd0a70f7a, 0x8fa40e6d, 0x2287756f, 0xfa641151,
        0x0c9ecb00, 0xbf0aa207, 0x6198f390, 0x2e9f6580, 0xdc0eb917, 0xdd6858e6,
        0x7fa281b3, 0x9e87515b, 0xb0e82c5a, 0x62660a5e, 0x4f4d2f09, 0x60d15e58,
        0x43867b4b, 0xf0206b4b, 0x16b0b8c4, 0xd8c07e88, 0x94829377, 0x7f4a5697,
        0x06060c49, 0x82e2d09c, 0xd475f492, 0x1a877579, 0x51c5188f, 0x3429fa90,
        0x83e20e8b, 0x868b4491, 0xcb99a80e, 0x66a85817, 0x550d53bf, 0x944a9590,
        0x439b16ac, 0xecb28120, 0x9a3f9e91, 0x6a12b48d, 0xe00c6d37, 0x2695c026,
        0x35687799, 0x095b357e, 0x8549646b, 0x00c7324c, 0x1d44cda8, 0x0b8a2139,
        0xdd2d2426, 0x944b0051, 0x9bb765b2, 0xb7ed5606, 0x733a411a, 0xdf84501a,
        0x5824c15d, 0x6a9390eb, 0x973a886a, 0x0da36021, 0x47e2714c, 0x0a169b88,
        0xb75470d0, 0x0447d2ed, 0x9e0839e5, 0x0c9462fc, 0x7b58742d, 0x539665bc,
        0x14032a1e, 0x0e5d1e22, 0x718f673e, 0xd23e5904, 0x55d045d6, 0xf20a3205,
        0xed435c24, 0xd986ff1f, 0xcd6932dd, 0x14041b63, 0x0d21659a, 0x69687e1a,
        0x9f518e87, 0x000492cb, 0x43e067c2, 0x2e650e85, 0x0d6ab68a, 0x4e6e6659,
        0x14068305, 0x0f295b9d, 0x588efc49, 0x47895e63, 0x1e36017b, 0x6cc8a615,
        0x18c4e402, 0x0e7a4ee5, 0x08537b0c, 0x9698d249, 0x3d0014b2, 0x1dc42542,
        0xa7d807e6, 0xd7fe48d9, 0x05f08816, 0x6a6d6342, 0x656b856a, 0x45ed118f,
        0x8c7e2b6a, 0xe295c52c, 0x2a0c6496, 0x101a7509, 0x38923a1a, 0x5a2d48f9,
        0xa7f7a77d, 0x9a848c26, 0xa3ed1944, 0x501c51a9, 0x2213769c, 0xa1d5f30e,
        0x19a9f4c3, 0x794b63ec, 0x9617300c, 0xa4c6f966, 0x2c64b63e, 0x1b5ae59e,
        0xa9b37ff9, 0x08018e69, 0x8c99eb7d, 0x0d0322c3, 0x10e19a6d, 0x6a567676,
        0x780d60db, 0x40166a20, 0x6e00ab80, 0x0fe32442, 0xd9e487da, 0x4c22e432,
        0x015a9957, 0x9b9a4c07, 0x45eb2f3f, 0x959c5d79, 0x68fd83ef, 0x629555c8,
        0x746ab21f, 0x2c938166, 0x8aef6a12, 0x56ef7d3f, 0x1ac62c93, 0x28972f69,
        0xb029a1b9, 0x2b068864, 0x2d17c768, 0x66c80889, 0x25a953e3, 0xa6607d2f,
        0x19a86840, 0x3e18a004, 0x464e8156, 0xd6b4e073, 0xa9c90f23, 0x12c418f7,
        0x9c0d16d0, 0xd1786523, 0xab339d33, 0xd6c4b92b, 0xd4756531, 0xd6ecfa02,
        0xb1a9fb9e, 0x02830f36, 0x4896706e, 0x69680076, 0x228e93ee, 0x30122240,
        0x1034f5aa, 0x60b72186, 0x87a71830, 0x76c96574, 0x1e1694f3, 0x80356c52,
        0x3560662d, 0x2d1c95ee, 0xd3891462, 0x2984b907, 0x3b4009ed, 0x73872c63,
        0x69502ab8, 0x9f191b7d, 0x762f0170, 0x22055673, 0xeca35c24, 0x14041b63,
        0x45c92984, 0x72a5a549, 0x52485e92, 0x4879fb97, 0x685d6880, 0xd803004d,
        0x9f086036, 0x296068d3, 0x6916fb29, 0x8544974d, 0x42967667, 0xa4d96c9e,
        0x367f08bf, 0x9a84d412, 0x3a48e7e1, 0x0952d7e0, 0xaa061e89, 0xb479424c,
        0x3630f9a2, 0x8ec86608, 0x2c262170, 0x6562095c, 0x664a7c06, 0xd8cf63f6,
        0x3f5cda07, 0x7a834241, 0xd9e5a1b3, 0x280e2270, 0xd9c20a40, 0xdfecfa00,
        0xa7d8250d, 0xd986a4bc, 0xa7a1a0d3, 0xb689728e, 0xb0eb209c, 0xb63f350c,
        0x1994b986, 0x222a0134, 0x77c2cb4e, 0x36688da5, 0x2e0f0c08, 0x3efd116c,
        0x438676a6, 0x4120891d, 0xc8759e6e, 0x77b73892, 0x5a4d1667, 0x7387340e,
        0x7f443d3b, 0x84687797, 0x5b3992b4, 0x24749f12, 0x8d1e2858, 0xf6702c2e,
        0xb6c7d3da, 0x95992984, 0x933b9188, 0xef26871a, 0x5fa88785, 0x717c385a,
        0x6ab22b40, 0x0a149f4e, 0x067160cb, 0x3344605e, 0x64319806, 0x9e87796f,
        0x83e2501a, 0xd2a49b80, 0xbe258031, 0x3c719e30, 0x6bcc0912, 0x1e07b827,
        0x4f4d1e2a, 0x1c801e0d, 0xa2c4f03f, 0xca2d2f79, 0x33480252, 0x27878345,
        0x6735e23a, 0xd88876c1, 0x20ed5323, 0xe11e5f03, 0x1d471549, 0x705d540d,
        0x7c490a04, 0x064a3875, 0xae287232, 0x2035985e, 0xb6475730, 0x4c2b9a75,
        0x410b0292, 0x6f699043, 0x26727605, 0x04464c0a, 0x62e6e003, 0x3a4f89d5,
        0x9f36e4f3, 0xfa5260dd, 0x7f201008, 0x830b0002, 0x1404ed37, 0x289b4f99,
        0xd155d0a0, 0xbb141251, 0x81561f52, 0x6005697d, 0x1800f135, 0x9e73fb2e,
        0xdc4f805a, 0x5109b0b9, 0x5aa12a76, 0x7d945a0b, 0xa9076651, 0xd1b50428,
        0x918378d3, 0x9f53833f, 0xaa201662, 0xa14a1599, 0x367f08c4, 0x0fa27f42,
        0x20c78a06, 0x0e964177, 0xa43651b1, 0xbb0f592d, 0x0ed50917, 0x66f54c25,
        0x98719f96, 0x82f23246, 0x959e4c19, 0x46424d1a, 0x48e11114, 0x63444458,
        0x48083812, 0x05937a6b, 0x0952d708, 0x40366114, 0xa4707c0a, 0x4e0a7eb5,
        0x4b7f9408, 0xbfd39763, 0x47d96979, 0x2d90d796, 0x408d6d67, 0x61955b93,
        0x8c792379, 0x2098ed23, 0x47a95054, 0x666b6c00, 0xa31e8d4a, 0x2d75a892,
        0x19e7a8a1, 0xe296a2fa, 0x6fa79690, 0x84687612, 0x39a3b680, 0x409d6f43,
        0x20d7f951, 0x80ca238a, 0x2774c8b3, 0xd0fe6a26, 0x4e9d690a, 0xa9c34e84,
        0xc4e92a27, 0xd4c0fa21, 0x5e56d4c0, 0x7cd2547b, 0x9519acfe, 0x76b66804,
        0x7ed04273, 0xefd34551, 0x56a0c598, 0x6ed97ed5, 0x9f446059, 0x9508542c,
        0x36ae050f, 0x6b87be98, 0x43867568, 0x1f1961a8, 0x0d287c88, 0x7f1e5e0a,
        0x347c617e, 0xca629815, 0x4cce1121, 0xc8770281, 0x8d601a07, 0x5ad89f41,
        0x5680155b, 0x00d07223, 0x6d9f95f4, 0xa7a0c71a, 0xd6e545d0, 0xef85fa50,
        0xdc2125e9, 0x82f9d51e, 0x446e5473, 0x8f72a440, 0x3a60c6d2, 0x181e9f1a,
        0x9f0d3674, 0xd2c3e177, 0x1e360f06, 0xc864a789, 0x6b89ae65, 0xb2148281,
        0x1034c441, 0xa43d8e57, 0x0b8929e7, 0xd88812c6, 0xec80d216, 0xdd1e095a,
        0x323c2ab9, 0x43be7c1e, 0xfaef827b, 0x2287c917, 0x6af6c5e7, 0xca5ffaa8,
        0x5015b67a, 0x9456bc98, 0x8c7075c3, 0x2e0bfa93, 0x8dd8a803, 0x2b0638ef,
        0x831a2936, 0x07f5963a, 0x897f2670, 0x5a1a1f0a, 0x2e2d6349, 0xcd693110,
        0x5c421711, 0xc2e79685, 0x076a5c10, 0x53400a40, 0x46ea2322, 0x8e8a604c,
        0xd1d497c2, 0x241d7237, 0x5f24259b, 0xa9f8021c, 0x44e99f91, 0x76d54d24,
        0x3f53856b, 0x0731f82e, 0x6c72e293, 0xa0e698d2, 0xa44c1071, 0x2f9cb79f,
        0xef269389, 0x82f09dcf, 0x7f48b9a1, 0x2236a9a0, 0xd8929d20, 0x08aa868f,
        0x78ab5a39, 0x573b9d62, 0xae2c5450, 0xd9e6e5a0, 0xed642674, 0x9e971485,
        0x8085fa4c, 0x24a59f51, 0x6e7880d4, 0xb8007621, 0x53297a7a, 0x808803ab,
        0x833e2188, 0x3d0d350c, 0x5368a4a2, 0x94dfd236, 0xd8562d9c, 0x1fe23145,
        0xc59560f4, 0x1d7c385c, 0xc7548773, 0x88f28681, 0x718f4007, 0x53580556,
        0x8a16c724, 0xdf05e267, 0x1d37ef95, 0xbf329ebc, 0x0ab66e4a, 0x2b8e3a24,
        0x199347d4, 0x4f494a28, 0xaeef5585, 0x42f70eb4, 0x2964724b, 0xdf59b36d,
        0xc7781b2e, 0x6d70a927, 0x08a465d9, 0x36412952, 0x0287d3e0, 0x5c4a754e,
        0x57121685, 0x4e6e0ef0, 0x7b5d636c, 0x5b9b7e71, 0x23ea415b, 0x76211246,
        0x6a2c2668, 0x651c6c57, 0xf6d601a4, 0x61001a18, 0x848e026e, 0x89791004,
        0x0c9d7494, 0xa553ab49, 0xa085eebe, 0x5d9b6a03, 0x498e09f5, 0x40026e25,
        0x7b99c7d4, 0x4858907e, 0xdf1076b3, 0x2f9746e5, 0x9449f831, 0xd0011bb5,
        0x1712a2ee, 0x83e20ec4, 0xbc28084a, 0x3d0ab47c, 0x5d0e2c8a, 0x64245995,
        0x9f29aa48, 0x9a888c3a, 0x0a62377b, 0x35639198, 0x1a86ed42, 0x0e2b9c3f,
        0x78726588, 0x76e6a14d, 0xa886c559, 0xce91807d, 0x3da86c07, 0x3a4ab2b5,
        0x839d3753, 0x0ca0c083, 0x2cb66a7a, 0x51486cb7, 0x72cae7da, 0x1e03c155,
        0xf247291a, 0x2e67a7b8, 0x7d25e076, 0x29bfb472, 0x35bb37b9, 0x93309a49,
        0xa7f0e74f, 0x8965f7c0, 0x79ae40d7, 0x2d057776, 0x323a6f1d, 0x05f1e16f,
        0x7480a240, 0xf695627a, 0x04467e2a, 0x2cb37887, 0xbc358509, 0xaa20eb60,
        0x031846c4, 0xd1b4cd60, 0x71790468, 0x4f65b61e, 0x550a116b, 0x944439c2,
        0x6a5ca8e3, 0x89e8020d, 0x3a233b8a, 0xc1073841, 0x0c01a2b0, 0x18ed1d41,
        0x32087595, 0x946e3d23, 0x2e425027, 0x0c9a444a, 0xa87d24d2, 0xcd50c455,
        0xa22b1009, 0x098679d7, 0x3bf92982, 0x8962f928, 0x3c78d780, 0x98b5ef0e,
        0x19941a87, 0x77c08000, 0x743900b3, 0x000c0199, 0xa926e2e5, 0x2ef5c39c,
        0xd1552a44, 0x5500aa2a, 0x897a9561, 0x4b7b2512, 0x02830f06, 0xdfab3994,
        0x0974b73b, 0x7a220261, 0x1f0ea3f3, 0x6e2f4f22, 0xb7975b31, 0x92518e24,
        0x3708a329, 0xd0e8354c, 0x003e839e, 0x808d7a1f, 0x4c46f7f0, 0xed0e1627,
        0x56a94f6c, 0x9e8c3a11, 0x4b2c4516, 0x317c9190, 0x524e9314, 0x47e923e5,
        0x01889895, 0x2cb22b79, 0x00e12d4d, 0xd65355eb, 0x320743b5, 0x5e0f9b31,
        0xd03d0246, 0x90e66d98, 0x1404172f, 0x7486e908, 0x9c5d0f1f, 0x7ec61826,
        0xc4557997, 0xc1a43a85, 0x2c75850d, 0x41b80327, 0x4f64249a, 0x7e44e2b0,
        0x83852028, 0x72a448c9, 0x5d0825c7, 0x8b8e05e5, 0x64245645, 0x8e5781a7,
        0x205a1097, 0x72288077, 0xb98845c4, 0x5074e080, 0x31697203, 0xa9116e01,
        0x78a59489, 0xedc087a3, 0x920a7b22, 0x095b62b1, 0x0d12e847, 0x29606c4b,
        0x8bb11c1e, 0x2e6ab4f0, 0x55ef0e85, 0xe005a415, 0x77ed9002, 0x1cd79a1f,
        0x2d3a681e, 0x8e8606e1, 0x4f65089e, 0x409517d9, 0x42eb7e7b, 0x973a8718,
        0x6a0f7c7d, 0xd0d8924b, 0x96489370, 0x407b7145, 0x31057e93, 0x9f54668b,
        0x6c6e76cc, 0x7a80b875, 0x35661d76, 0xae7d6c62, 0x90f6b4d6, 0x9911e3b6,
        0xd1080355, 0x907e5c46, 0xa08544f8, 0x3500c410, 0x2610d94f, 0x2b8b9fbe,
        0x0114a84b, 0x75662707, 0x12a8326d, 0xb479427b, 0x6a1297b4, 0xd4f6a7bc,
        0x2a052161, 0x4b783d60, 0x43ab9f2d, 0x05b97002, 0x0da09722, 0x673994e7,
        0x01e8abef, 0x2f394b28, 0x9a2636bf, 0x80517726, 0x00085870, 0x82120a93,
        0x676b7e61, 0x83e07ef4, 0x08018e96, 0x33ca44d7, 0x2a60814f, 0x165a2531,
        0x14066e2c, 0x20760432, 0x7a2d8a00, 0x5a1b32d0, 0x4a47d252, 0x6436e297,
        0x45a906ac, 0x91834241, 0xd75b42d7, 0x31464350, 0x77c2763f, 0x446d510e,
        0xaa347718, 0x367e9154, 0x52b77b10, 0x946b1420, 0x54620f4c, 0x2a62ffed,
        0xb888b15d, 0xe84a25e8, 0x1c8ed343, 0x6b876402, 0x62bf36ef, 0xc0e83b8b,
        0x56a371b6, 0x0d28562d, 0xd0479d0d, 0xe47514a6, 0xa39d2ef9, 0x0cb6657a,
        0x5a9a147e, 0x4e0474ef, 0x677b1658, 0xea7364d9, 0x6a87c125, 0x20067b82,
        0x0bf8061e, 0xd5405086, 0x3d434d7d, 0x77977461, 0x117498c8, 0x560f4237,
        0xa7f433cb, 0x4f494c2e, 0xd9c20a9d, 0x674d2bcf, 0x569a98ac, 0x84000301,
        0x5ef657c7, 0x82b49282, 0x26585141, 0x7784f180, 0x1031441e, 0xa0852802,
        0x8035b804, 0x72a5a54e, 0x1d0f5076, 0x7383628d, 0x6a13d824, 0x1c467761,
        0x04467003, 0x8c7a6b12, 0x3f58a0b0, 0x8e820e8e, 0x23761919, 0x8087963b,
        0x480f4f10, 0x19f2010f, 0xa096c141, 0x5333246a, 0x34460f78, 0x286088f2,
        0x3d142f2c, 0x56c42938, 0x16462719, 0x7160c885, 0xd0272c72, 0xec4e8574,
        0x334460e7, 0xc6d49827, 0xa4a42823, 0xbf09282d, 0xd0db92b2, 0xec0c78a4,
        0x79471188, 0x723ad63a, 0x7d9774e1, 0x26117d1e, 0x47b2c974, 0x05f56a59,
        0x5018619e, 0x472491a6, 0x181a4b27, 0x3f8863f6, 0x306283b8, 0x6d9d40b3,
        0x01a48920, 0x74620f4c, 0x330089a6, 0x5e2b4676, 0x789a2443, 0x0e5e0329,
        0x2966838e, 0x285906d2, 0xd756ad9c, 0x288b89e3, 0x3f159187, 0x4a737f26,
        0x506509f6, 0x39c09423, 0x2d3a3162, 0x51c72836, 0xf0229867, 0x0113c4c9,
        0xa0b02580, 0x264906f3, 0x936109f2, 0xeb9c2f6d, 0x82703a95, 0x92610d40
    };

    private static final int bf_crypt_ciphertext[] = {
        0x4f726167, 0x65616e20, 0x53697870, 0x656e6365, 0x203a2042, 0x42437279
    };

    private static final char base64_code[] = {
        '.', '/', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
        'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V',
        'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
        'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
        'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5',
        '6', '7', '8', '9'
    };

    private static final byte index_64[] = {
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  0,  1,
        54, 55, 56, 57, 58, 59, 60, 61, 62, 63, -1, -1, -1, -1, -1, -1,
        -1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15, 16,
        17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26,
        27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42,
        43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1
    };

    private int P[];
    private int S[];

    private static void encode_base64(byte d[], int len, StringBuilder rs) {
        int off = 0;
        int c1, c2;

        if (len <= 0 || len > d.length)
            throw new IllegalArgumentException("Invalid len");

        while (off < len) {
            c1 = d[off++] & 0xff;
            rs.append(base64_code[(c1 >> 2) & 0x3f]);
            c1 = (c1 & 0x03) << 4;
            if (off >= len) {
                rs.append(base64_code[c1 & 0x3f]);
                break;
            }
            c2 = d[off++] & 0xff;
            c1 |= (c2 >> 4) & 0x0f;
            rs.append(base64_code[c1 & 0x3f]);
            c1 = (c2 & 0x0f) << 2;
            if (off >= len) {
                rs.append(base64_code[c1 & 0x3f]);
                break;
            }
            c2 = d[off++] & 0xff;
            c1 |= (c2 >> 6) & 0x03;
            rs.append(base64_code[c1 & 0x3f]);
            rs.append(base64_code[c2 & 0x3f]);
        }
    }

    private static byte char64(char x) {
        if ((int)x < 0 || (int)x >= index_64.length)
            return -1;
        return index_64[(int)x];
    }

    private static byte[] decode_base64(String s, int maxolen) {
        StringBuilder rs = new StringBuilder();
        int off = 0, slen = s.length(), olen = 0;
        byte ret[];
        byte c1, c2, c3, c4;

        if (maxolen <= 0)
            throw new IllegalArgumentException("Invalid maxolen");

        ret = new byte[maxolen];

        while (off < slen && olen < maxolen) {
            c1 = char64(s.charAt(off++));
            c2 = char64(s.charAt(off++));
            if (c1 == -1 || c2 == -1)
                break;
            ret[olen++] = (byte)((c1 << 2) | ((c2 & 0x30) >> 4));
            if (off >= slen || olen >= maxolen)
                break;
            c3 = char64(s.charAt(off++));
            if (c3 == -1)
                break;
            ret[olen++] = (byte)(((c2 & 0x0f) << 4) | ((c3 & 0x3c) >> 2));
            if (off >= slen || olen >= maxolen)
                break;
            c4 = char64(s.charAt(off++));
            if (c4 == -1)
                break;
            ret[olen++] = (byte)(((c3 & 0x03) << 6) | c4);
        }
        return ret;
    }

    private final void encipher(int lr[], int off) {
        int i, l = lr[off], r = lr[off + 1];

        l ^= P[0];
        for (i = 0; i <= BLOWFISH_NUM_ROUNDS - 2; i += 2) {
            r ^= ((S[(l >> 24) & 0xff] + S[0x100 | ((l >> 16) & 0xff)]) ^ S[0x200 | ((l >> 8) & 0xff)]) + S[0x300 | (l & 0xff)] ^ P[i + 1];
            l ^= ((S[(r >> 24) & 0xff] + S[0x100 | ((r >> 16) & 0xff)]) ^ S[0x200 | ((r >> 8) & 0xff)]) + S[0x300 | (r & 0xff)] ^ P[i + 2];
        }
        lr[off] = r ^ P[BLOWFISH_NUM_ROUNDS + 1];
        lr[off + 1] = l;
    }

    private void init_key() {
        P = (int[]) P_array.clone();
        S = (int[]) S_box.clone();
    }

    private void key(byte key[]) {
        int i, j, data, len = key.length;
        int lr[] = new int[2];

        j = 0;
        for (i = 0; i < P.length; i++) {
            data = ((key[j] & 0xff) << 24) | ((key[(j + 1) % len] & 0xff) << 16) | ((key[(j + 2) % len] & 0xff) << 8) | (key[(j + 3) % len] & 0xff);
            P[i] ^= data;
            j = (j + 4) % len;
        }

        lr[0] = 0;
        lr[1] = 0;
        for (i = 0; i < P.length; i += 2) {
            encipher(lr, 0);
            P[i] = lr[0];
            P[i + 1] = lr[1];
        }

        for (i = 0; i < S.length; i += 2) {
            encipher(lr, 0);
            S[i] = lr[0];
            S[i + 1] = lr[1];
        }
    }

    private void ekskey(byte data[], byte key[]) {
        int i, j, kd, dd, klen = key.length, dlen = data.length;
        int lr[] = new int[2];

        j = 0;
        for (i = 0; i < P.length; i++) {
            kd = ((key[j] & 0xff) << 24) | ((key[(j + 1) % klen] & 0xff) << 16) | ((key[(j + 2) % klen] & 0xff) << 8) | (key[(j + 3) % klen] & 0xff);
            P[i] ^= kd;
            j = (j + 4) % klen;
        }

        j = 0;
        for (i = 0; i < P.length; i += 2) {
            dd = ((data[j] & 0xff) << 24) | ((data[(j + 1) % dlen] & 0xff) << 16) | ((data[(j + 2) % dlen] & 0xff) << 8) | (data[(j + 3) % dlen] & 0xff);
            lr[0] ^= dd;
            j = (j + 4) % dlen;
            dd = ((data[j] & 0xff) << 24) | ((data[(j + 1) % dlen] & 0xff) << 16) | ((data[(j + 2) % dlen] & 0xff) << 8) | (data[(j + 3) % dlen] & 0xff);
            lr[1] ^= dd;
            j = (j + 4) % dlen;
            encipher(lr, 0);
            P[i] = lr[0];
            P[i + 1] = lr[1];
        }

        for (i = 0; i < S.length; i += 2) {
            dd = ((data[j] & 0xff) << 24) | ((data[(j + 1) % dlen] & 0xff) << 16) | ((data[(j + 2) % dlen] & 0xff) << 8) | (data[(j + 3) % dlen] & 0xff);
            lr[0] ^= dd;
            j = (j + 4) % dlen;
            dd = ((data[j] & 0xff) << 24) | ((data[(j + 1) % dlen] & 0xff) << 16) | ((data[(j + 2) % dlen] & 0xff) << 8) | (data[(j + 3) % dlen] & 0xff);
            lr[1] ^= dd;
            j = (j + 4) % dlen;
            encipher(lr, 0);
            S[i] = lr[0];
            S[i + 1] = lr[1];
        }
    }

    private byte[] crypt_raw(byte data[], byte salt[], int log_rounds) {
        int c, i, j;
        int rounds;
        int ctext[] = (int[]) bf_crypt_ciphertext.clone();
        int clen = ctext.length;
        byte ret[];

        if (log_rounds < 4 || log_rounds > 31)
            throw new IllegalArgumentException("Bad number of rounds");

        rounds = 1 << log_rounds;
        if (salt.length != 16)
            throw new IllegalArgumentException("Bad salt length");

        init_key();
        ekskey(salt, data);
        for (i = 0; i < rounds; i++) {
            key(data);
            key(salt);
        }

        for (i = 0; i < 64; i++) {
            for (j = 0; j < clen; j += 2)
                encipher(ctext, j);
        }

        ret = new byte[clen * 4];
        for (i = 0, j = 0; i < clen; i++) {
            ret[j++] = (byte)((ctext[i] >> 24) & 0xff);
            ret[j++] = (byte)((ctext[i] >> 16) & 0xff);
            ret[j++] = (byte)((ctext[i] >> 8) & 0xff);
            ret[j++] = (byte)(ctext[i] & 0xff);
        }
        return ret;
    }

    private static byte[] streamToBytes(byte password[]) {
        byte ret[] = new byte[password.length + 1];
        System.arraycopy(password, 0, ret, 0, password.length);
        ret[password.length] = 0;
        return ret;
    }

    public static String hashpw(String password, String salt) {
        BCrypt B;
        String real_salt;
        byte passwordb[], saltb[], hashedb[];

        int minor = 0;
        int rounds = 0;
        int off = 0;

        if (salt == null)
            throw new IllegalArgumentException("salt cannot be null");

        int len = salt.length();

        if (len < 28)
            throw new IllegalArgumentException("Invalid salt length");

        if (salt.charAt(0) != '$' || salt.charAt(1) != '2')
            throw new IllegalArgumentException("Invalid salt revision");

        if (salt.charAt(2) == '$')
            off = 3;
        else {
            minor = salt.charAt(2);
            if ((minor != 'a' && minor != 'b' && minor != 'y') || salt.charAt(3) != '$')
                throw new IllegalArgumentException("Invalid salt revision");
            off = 4;
        }

        if (salt.charAt(off + 2) > '$')
            throw new IllegalArgumentException("Missing salt rounds");

        rounds = Integer.parseInt(salt.substring(off, off + 2));
        real_salt = salt.substring(off + 3, off + 25);

        try {
            passwordb = streamToBytes(password.getBytes("UTF-8"));
        } catch (Exception e) {
            throw new RuntimeException("UTF-8 not supported");
        }

        saltb = decode_base64(real_salt, 16);

        B = new BCrypt();
        hashedb = B.crypt_raw(passwordb, saltb, rounds);

        StringBuilder rs = new StringBuilder();
        rs.append("$2a$");
        if (rounds < 10)
            rs.append("0");
        rs.append(rounds);
        rs.append("$");
        encode_base64(saltb, saltb.length, rs);
        encode_base64(hashedb, bf_crypt_ciphertext.length * 4 - 1, rs);
        return rs.toString();
    }

    public static String gensalt(int log_rounds, SecureRandom random) {
        StringBuilder rs = new StringBuilder();
        byte rnd[] = new byte[16];

        random.nextBytes(rnd);

        rs.append("$2a$");
        if (log_rounds < 10)
            rs.append("0");
        rs.append(log_rounds);
        rs.append("$");
        encode_base64(rnd, rnd.length, rs);
        return rs.toString();
    }

    public static String gensalt(int log_rounds) {
        return gensalt(log_rounds, new SecureRandom());
    }

    public static String gensalt() {
        return gensalt(BCRYPT_COST_TIME, new SecureRandom());
    }

    public static boolean checkpw(String plaintext, String hashed) {
        if (plaintext == null || hashed == null || hashed.length() < 28) {
            return false;
        }
        try {
            return equalsNoEarlyBreak(hashed, hashpw(plaintext, hashed));
        } catch (Exception e) {
            return false;
        }
    }

    private static boolean equalsNoEarlyBreak(String a, String b) {
        int diff = a.length() ^ b.length();
        for (int i = 0; i < a.length() && i < b.length(); i++)
            diff |= a.charAt(i) ^ b.charAt(i);
        return diff == 0;
    }
}
