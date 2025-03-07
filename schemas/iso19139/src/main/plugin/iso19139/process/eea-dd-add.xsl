<?xml version="1.0" encoding="UTF-8"?>
<!--
  ~ Copyright (C) 2001-2016 Food and Agriculture Organization of the
  ~ United Nations (FAO-UN), United Nations World Food Programme (WFP)
  ~ and United Nations Environment Programme (UNEP)
  ~
  ~ This program is free software; you can redistribute it and/or modify
  ~ it under the terms of the GNU General Public License as published by
  ~ the Free Software Foundation; either version 2 of the License, or (at
  ~ your option) any later version.
  ~
  ~ This program is distributed in the hope that it will be useful, but
  ~ WITHOUT ANY WARRANTY; without even the implied warranty of
  ~ MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
  ~ General Public License for more details.
  ~
  ~ You should have received a copy of the GNU General Public License
  ~ along with this program; if not, write to the Free Software
  ~ Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301, USA
  ~
  ~ Contact: Jeroen Ticheler - FAO - Viale delle Terme di Caracalla 2,
  ~ Rome - Italy. email: geonetwork@osgeo.org
  -->
<xsl:stylesheet xmlns:gmd="http://www.isotc211.org/2005/gmd"
                xmlns:gco="http://www.isotc211.org/2005/gco"
                xmlns:srv="http://www.isotc211.org/2005/srv"
                xmlns:gmx="http://www.isotc211.org/2005/gmx"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                xmlns:sparql="http://www.w3.org/2005/sparql-results#"
                xmlns:util="java:org.fao.geonet.util.XslUtil"
                xmlns:skos="http://www.w3.org/2004/02/skos/core#"
                xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:geonet="http://www.fao.org/geonetwork"
                exclude-result-prefixes="#all"
                version="2.0">

  <xsl:output indent="yes"/>

  <xsl:param name="replaceLinks"
             select="''"/>

  <xsl:variable name="uuid"
                select="//gmd:fileIdentifier/gco:CharacterString"/>


  <xsl:template match="gmd:transferOptions/*">
    <xsl:copy>
      <xsl:copy-of select="gmd:onLine/*[not(contains($replaceLinks, gmd:linkage/*/text()))]"/>
<xsl:message>=<xsl:value-of select="$replaceLinks"/> </xsl:message>
      <gmd:onLine>
        <gmd:CI_OnlineResource>
          <gmd:linkage>
            <gmd:URL>https://sdi.eea.europa.eu/data/<xsl:value-of select="$uuid"/></gmd:URL>
          </gmd:linkage>
          <gmd:protocol>
            <gco:CharacterString>WWW:URL</gco:CharacterString>
          </gmd:protocol>
          <gmd:name>
            <gco:CharacterString>Direct Download</gco:CharacterString>
          </gmd:name>
          <gmd:description>
            <gco:CharacterString>
              <xsl:for-each select="distinct-values(gmd:onLine/*[contains($replaceLinks, gmd:linkage/*/text())]/gmd:description/*/text())">
                <xsl:value-of select="."/>
                &#160;
                &#160;
              </xsl:for-each>
            </gco:CharacterString>
          </gmd:description>
        </gmd:CI_OnlineResource>
      </gmd:onLine>
    </xsl:copy>
  </xsl:template>

  <!-- Do a copy of every nodes and attributes -->
  <xsl:template match="@*|node()|comment()">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()|comment()"/>
    </xsl:copy>
  </xsl:template>

  <!-- Remove geonet:* elements. -->
  <xsl:template match="geonet:*" priority="2"/>

</xsl:stylesheet>
