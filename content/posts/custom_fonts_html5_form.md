---
title: Using Custom Fonts in Adobe HTML5 Forms
description: Adobe's HTML5 Form solution provides a rendition similar to dynamic forms with some minor differences. One such difference is how the fonts are to be used. In PDF Forms, font can be embedded inside the PDF File while that is not the case with HTML 5 Forms which assumes font to be present on client's machine. But with web fonts, customer's can achieve the same with just little bit of code
tags:
  - Adobe
  - AEM
  - HTML5 Forms
  - Tutorial
publishedAt: 2021-03-04
lastUpdatedAt: 2021-06-14
changelist:
  - rev: 1
    date: 2021-06-14
    changes:
      - minor formatting change in the code
      - adding link to the web font specification
      - linking appendix with the main section
---

# Introduction

Adobe's HTML5 Form solution provides a rendition similar to dynamic forms with some minor differences. One such
difference is how the fonts are to be used. In PDF Forms, font can be embedded inside the PDF File while that is not the case
with HTML 5 Forms which assumes font to be present on client's machine. But with modern web technologies, there are mechanisms which can enable customers to provide their users with the same experience as with PDF Forms. The guide below provides step by step details
to achieve the same.

Before starting this guide make sure you have latest AEM Forms setup. This guide has been tested on the same and the author doesn't take any guarantee for the old versions.

# Steps

## Create a custom profile

Even though the [official article](https://experienceleague.adobe.com/docs/experience-manager-65/forms/html5-forms/custom-profile.html?lang=en#create-the-profile-renderer-script) provides detailed instructions to create a custom profile, I am going to mention the exact changes needed for this demo to work.

1. Navigate to CRXDE Lite.
2. Create the following path under `content` : `somerandomstuff/html5`. Ensure the `jcr:primaryType` of each of the nodes is `sling:Folder` otherwise the next step will not work. And of course, you can name this folders anything you like, I just needed some names for this guide. If you don't know how to create a path, there is a [section](#create-a-path) in the end to demonstrate that
3. Copy the node `default` present at `/content/xfaforms/profiles/` and paste it inside `/content/somerandomstuff/html5`. Rename it to `fontdemo`. Ensure the node `fontdemo` has the following properties. Except for `sling:resourceSuperType` you can change the value of any property as per your liking and ensure that `sling:resourceType` is a path to a `sling:Folder` under `/apps`

| Property                |  Type  |                  Value                  |
| ----------------------- | :----: | :-------------------------------------: |
| jcr:description         | String | Demo to showcase custom fonts rendition |
| jcr:title               | String |           Font Demonstration            |
| sling:resourceType      | String |     somerandomstuff/html5/fontdemo      |
| sling:resourceSuperType | String |            xfaforms/profile             |

4. Navigate to `apps` and create the following path `somerandomstuff/html5/fontdemo` and as mentioned in step 2 ensure the `jcr:primaryType` of each of the nodes is `sling:Folder`
5. Create a file `html.jsp` inside `somerandomstuff/html5/fontdemo`.
6. Copy the contents of the file `/libs/xfaforms/profile/html.jsp` to `/apps/somerandomstuff/html5/fontdemo/html.jsp`.

Till now we have created a custom profile as per the official documentation. But since we are not interested in changing the look and feel of the page, we are not going to deal with the contents with the html.jsp and only add a specific instruction for the browsers to download the font

## Create a clientlib for serving the custom font

As clearly mentioned above, the [official documentation](https://experienceleague.adobe.com/docs/experience-manager-65/developing/introduction/clientlibs.html?lang=en#overriding-libraries-in-lib) provides details about a clientlib. It is recommended to read that before proceeding ahead.

1. Open CRXDE Lite and navigate to `/apps/somerandomstuff/html5/fontdemo/`.
2. Create a cq:clientLibraryFolder named `fontfile` with category `somerandomstuff.html5.fontdemo`. Follow the steps provided in [official doc](https://experienceleague.adobe.com/docs/experience-manager-65/developing/introduction/clientlibs.html?lang=en#create-a-client-library-folder)
3. Navigate to `/apps/somerandomstuff/html5/fontdemo/fontfile` and create a node of type `nt:unstructured` and name as `font.ttf`. Save before proceeding ahead.
4. Navigate to `/apps/somerandomstuff/html5/fontdemo/fontfile/font.ttf` and open the properties tab.
5. In the Name field enter `jcr:data` and choose `Binary` in the type Field. Click on Add and then click on Save at the top.
6. In the properties tab click on the newly added property `jcr:data`. A dialog will come up asking you to browse a file. Select the font file and upload it. Click on Save at the top.
7. Navigate to `/apps/somerandomstuff/html5/fontdemo/fontfile` and create a node of type `nt:file` and name as `style.css`. Save when done.
8. Open the newly created file `style.css` and paste the following content and save. Replace the font-family with the actual name of the font being used in XDP.

```
@font-face {
    font-family: "fontName";
    src: url('/apps/someerandomstuff/html5/fontdemo/fontfile/font.ttf');
}
```

<div class="info"> 
The above code is just an illustration, the actual properties and fonts should be defined as per the 
<a href="https://developer.mozilla.org/en-US/docs/Learn/CSS/Styling_text/Web_fonts">HTML Web Font Specification</a> and 
<a href="https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face">@font-face</a> property</div>

9. Navigate to `/apps/somerandomstuff/html5/fontdemo/fontfile` and create a node of type `nt:file` and name as `css.txt`. Save when done.
10. Open the newly created file `css.txt` and paste the following content and save. If you renamed your css file other than style.css in step 7, use that name here instead

```
style.css
```

After saving your work ensure that the client library is created correctly by opening a browser and navigating to the following url
`http://<server>:<port>/apps/somerandomstuff/html5/fontdemo/fontfile.css`. If you see the code you pasted in `style.css` appear you are good to go.

## Load the font in Custom Profile

1. Navigate to `/apps/somerandomstuff/html5/fontdemo/html.jsp` and add the following code in the `<head>` section of the html

```
<%@taglib prefix="ui" uri="http://www.adobe.com/taglibs/granite/ui/1.0" %>
<ui:includeClientLib categories="somerandomstuff.html5.fontdemo" />
```

# Appendix

## Create a Path

The instructions below provide details on how to create a path (for this tutorial) say `somerandomstuff/html5` under `content`. But the instructions are same for creating a path `x/y/z` under `a`

1. Open CRXDE Lite and navigate to `content`
2. Click on Create at the top. In the dialog fill in the following values.

| Property | Value           |
| -------- | :-------------- |
| Name     | somerandomstuff |
| Type     | sling:Folder    |

3. Click on Ok and then Click on Save.
4. Navigate to `/content/somerandomstuff`
5. Click on Create at the top. In the dialog fill in the following values.

| Property | Value        |
| -------- | :----------- |
| Name     | html5        |
| Type     | sling:Folder |

6. Click on Ok and then Click on Save.

Depending upon the path you need to create there can be more steps
