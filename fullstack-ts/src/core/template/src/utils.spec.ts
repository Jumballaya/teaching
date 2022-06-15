import { Template } from "..";
import { describe, expect, it } from "../../test";
import { getValue, renderTemplate, replaceValues } from "./utils";

describe('Template: Utils', () => {

  // it('Can use getValue to extract a value from an object', () => {
  //   const obj = { a: { b: { c: { b: { d: 'value' } } } } };
  //   const key = 'a.b.c.b.d';
  //   const got = getValue<string>(key, obj);
  //   expect(got).toEqual('value');
  // });

  // it('Can use getValue to extract an array value from an object', () => {
  //   const obj = { a: { b: { c: { b: { d: ['value', 'value'] } } } } };
  //   const key = 'a.b.c.b.d';
  //   const got = getValue<Array<string>>(key, obj);
  //   expect(got).not.toBeNull();
  //   if (got !== null) {
  //     expect(got.length).toEqual(2);
  //   }
  // });

  // it('Can use getValue to extract an object value from an object', () => {
  //   const obj = {
  //     title: 'title',
  //     subtitle: { x: 'subtitle' },
  //     items: ['a', 'b', 'c']
  //   }
  //   const key = 'subtitle.x';
  //   const got = getValue<string>(key, obj);
  //   expect(got).toEqual('subtitle');
  // });

  // it('Can use replaceValues to replace values', () => {
  //   const tmpl = '{{ x }} {{ x }} {{ x }} {{ x }}';
  //   const data = { x: 'val' };
  //   const expected = 'val val val val';
  //   expect(replaceValues(tmpl, data)).toEqual(expected);
  // });

  // it('Can use replaceValues to replace nested values', () => {
  //   const tmpl = '{{ data.x.y }}';
  //   const data = { data: { x: { y: 'value' } } };
  //   const expected = 'value';
  //   expect(replaceValues(tmpl, data)).toEqual(expected);
  // });

  // it('Can render a template with no changes', () => {
  //   const tmpl = 'no change';
  //   const data = {};
  //   const expected = 'no change';
  //   expect(renderTemplate(tmpl, data).rendered).toEqual(expected);
  // });

  // it('Can render a template with a variable change', () => {
  //   const tmpl = '{{ variable }}';
  //   const data = { variable: 'changed' };
  //   const expected = 'changed';
  //   expect(renderTemplate(tmpl, data).rendered).toEqual(expected);
  // });

  // it('Can render a template with an if statement', () => {
  //   const tmpl = '{{% if bool %}} something {{% endif %}}';
  //   const data = { bool: true };
  //   const expected = ' something ';
  //   expect(renderTemplate(tmpl, data).rendered).toEqual(expected);
  // });

  // it('Can render a template with an if statement', () => {
  //   const tmpl = '{{% if bool %}} something {{% endif %}}';
  //   const data = { bool: false };
  //   const expected = '';
  //   expect(renderTemplate(tmpl, data).rendered).toEqual(expected);
  // });

  // it('Can render a template with an if not statement', () => {
  //   const tmpl = '{{% if not bool %}} something {{% endif %}}';
  //   const data = { bool: false };
  //   const expected = ' something ';
  //   expect(renderTemplate(tmpl, data).rendered).toEqual(expected);
  // });

  // it('Can render a template with an if/else statement, if-body', () => {
  //   const tmpl = '{{% if bool %}} something {{% else %}} something else {{% endif %}}';
  //   const data = { bool: true };
  //   const expected = ' something ';
  //   expect(renderTemplate(tmpl, data).rendered).toEqual(expected);
  // });

  // it('Can render a template with an if/else statement, else-body', () => {
  //   const tmpl = '{{% if not bool %}} something {{% else %}} something else {{% endif %}}';
  //   const data = { bool: true };
  //   const expected = ' something else ';
  //   expect(renderTemplate(tmpl, data).rendered).toEqual(expected);
  // });

  // it('Can render nested if statements', () => {
  //   const tmpl = `{{% if not bool %}} something {{% else %}}{{% if bool2 %}} something else {{% else %}} something something else {{% endif %}}{{% endif %}}`;
  //   const data = { bool: true, bool2: false };
  //   const expected = ' something something else ';
  //   const stats = Template(tmpl, data);
  //   expect(stats.rendered).toEqual(expected);
  // });

  // it('Can render a template with a for loop', () => {
  //   const tmpl = '{{% for x of y %}}{{ x }} {{% endfor %}}';
  //   const data = { y: [1, 2, 3] };
  //   const expected = '1 2 3 ';
  //   expect(renderTemplate(tmpl, data).rendered).toEqual(expected);
  // });

  it('Can render a template with nested for loops', () => {
    // const tmpl = '{{% for row of table %}}{{% for col of row %}} {{ col }} {{% endfor %}}{{% endfor %}}';
    const tmpl = '{{% for row of table %}}{{% for col of row %}} {{ col }} {{% endfor %}}{{% endfor %}}';

    const data = {
      table: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ],
    }
    const expected = ' 1 2 3 4 5 6 7 8 9 0';
    const stats = Template(tmpl, data);
    expect(stats.rendered).toEqual(expected);
  });

});
