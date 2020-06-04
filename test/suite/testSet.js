const input = [
    '"{\\"name\\":\\"nishant\\",\\"age\\":21}"',
    '"{  \\"  name\\\\"    :   \\"nishant\\" , \\"age\\":21  }"',
    '"-((((mVadd.m_x:\\"modiji\\")~1) ((((add.t_en:\\"bjp\\")~1) ((m_en:\\"congress\\")~1) ((addI.item:\\"rahul gandhi\\")~1) mVadd.m_x_url:\\"mahatma\\")~1) hT:(#bapu) ((((mVadd.m_x:#bhakt mVadd.m_x:movies)~1) ((add.t_en:\\"#stars\\" m_en:\\"# acting\\" addI.item:\\"# actress\\" mVadd.m_x_url:\\"# models\\")~1))~1) ((mVadd.m_x:super*)~1) ((add.t_en:nike* m_en:nike* addI.item:nike* mVadd.m_x_url:nike*)~1) ((mVadd.m_x:boy)~1) ((((add.t_en:boy)~1) ((m_en:boy)~1) ((addI.item:boy)~1) mVadd.m_x_url:boy)~1))~1)"',
    '"   +add.lng:(  en    )  +add.m_t:( FACEBOOK INSTAGRAM TWITTER )  -     ( + ( -add.auMiss:[* TO *] +*:*) +mVadd.pl_id:(456_1)) (mVadd.m_x:\\"den\\\\\\\\nis macdonald\\\\\\"\\") "',
    '""',
    '"   "',
    '"{\\\\\\\\}"',
  ],
  output = [
    '{\n\t"name": "nishant",\n\t"age": 21\n}',
    '{\n\t"  name": "nishant",\n\t"age": 21\n}',
    '-(\n\t(\n\t\t(\n\t\t\t(\n\t\t\t\tmVadd.m_x: "modiji"\n\t\t\t)\n\t\t\t~1\n\t\t)\n\t\t(\n\t\t\t(\n\t\t\t\t(\n\t\t\t\t\t(\n\t\t\t\t\t\tadd.t_en: "bjp"\n\t\t\t\t\t)\n\t\t\t\t\t~1\n\t\t\t\t)\n\t\t\t\t(\n\t\t\t\t\t(\n\t\t\t\t\t\tm_en: "congress"\n\t\t\t\t\t)\n\t\t\t\t\t~1\n\t\t\t\t)\n\t\t\t\t(\n\t\t\t\t\t(\n\t\t\t\t\t\taddI.item: "rahul gandhi"\n\t\t\t\t\t)\n\t\t\t\t\t~1\n\t\t\t\t)\n\t\t\t\tmVadd.m_x_url: "mahatma"\n\t\t\t)\n\t\t\t~1\n\t\t)\n\t\thT: (\n\t\t\t#bapu\n\t\t)\n\t\t(\n\t\t\t(\n\t\t\t\t(\n\t\t\t\t\t(\n\t\t\t\t\t\tmVadd.m_x: #bhakt\n\t\t\t\t\t\tmVadd.m_x: movies\n\t\t\t\t\t)\n\t\t\t\t\t~1\n\t\t\t\t)\n\t\t\t\t(\n\t\t\t\t\t(\n\t\t\t\t\t\tadd.t_en: "#stars"\n\t\t\t\t\t\tm_en: "# acting"\n\t\t\t\t\t\taddI.item: "# actress"\n\t\t\t\t\t\tmVadd.m_x_url: "# models"\n\t\t\t\t\t)\n\t\t\t\t\t~1\n\t\t\t\t)\n\t\t\t)\n\t\t\t~1\n\t\t)\n\t\t(\n\t\t\t(\n\t\t\t\tmVadd.m_x: super*\n\t\t\t)\n\t\t\t~1\n\t\t)\n\t\t(\n\t\t\t(\n\t\t\t\tadd.t_en: nike*\n\t\t\t\tm_en: nike*\n\t\t\t\taddI.item: nike*\n\t\t\t\tmVadd.m_x_url: nike*\n\t\t\t)\n\t\t\t~1\n\t\t)\n\t\t(\n\t\t\t(\n\t\t\t\tmVadd.m_x: boy\n\t\t\t)\n\t\t\t~1\n\t\t)\n\t\t(\n\t\t\t(\n\t\t\t\t(\n\t\t\t\t\t(\n\t\t\t\t\t\tadd.t_en: boy\n\t\t\t\t\t)\n\t\t\t\t\t~1\n\t\t\t\t)\n\t\t\t\t(\n\t\t\t\t\t(\n\t\t\t\t\t\tm_en: boy\n\t\t\t\t\t)\n\t\t\t\t\t~1\n\t\t\t\t)\n\t\t\t\t(\n\t\t\t\t\t(\n\t\t\t\t\t\taddI.item: boy\n\t\t\t\t\t)\n\t\t\t\t\t~1\n\t\t\t\t)\n\t\t\t\tmVadd.m_x_url: boy\n\t\t\t)\n\t\t\t~1\n\t\t)\n\t)\n\t~1\n)',
    '+add.lng: (\n\ten\n)\n+add.m_t: (\n\tFACEBOOK\n\tINSTAGRAM\n\tTWITTER\n)\n-\n(\n\t+\n\t(\n\t\t-add.auMiss: [\n\t\t\t*\n\t\t\tTO\n\t\t\t*\n\t\t]\n\t\t+*: *\n\t)\n\t+mVadd.pl_id: (\n\t\t456_1\n\t)\n)\n(\n\tmVadd.m_x: "den\\\\nis macdonald\\""\n)',
    '',
    '',
    "{\n\t\\\\\n}",
  ];
  // eslint-disable-next-line no-unused-vars
  function check(){
    for(let i=0;i<input.length;i++)
    {
      console.log("Input: "+i);
      console.log(input[i]);
      console.log("Output: "+i);
      console.log(output[i]);
    }
  }

module.exports = {
  input,
  output,
};
